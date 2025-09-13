import express from "express";
import db from "../utils/db";
import createNotification from "../middleware/createNotification";
import authenticate from "../middleware/authenticate";
import { getUserId } from "../utils/util";

const router = express.Router();

// localhost:3000/friends
// get all friends of logged in user
router.get('/', authenticate, async (req, res) => {

  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query(
      `SELECT u.id, 
      u.username, 
      u.name, 
      u.picture, 
      f.status, 
      f.created,
      CASE 
          WHEN f.user_id = $1 THEN 'sent'
          ELSE 'received'
        END AS direction 
      FROM friends f
      JOIN users u ON u.id =  
      CASE 
        WHEN f.user_id = $1 THEN f.friend_id
        ELSE f.user_id
      END
      WHERE f.user_id = $1 OR f.friend_id = $1;`, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'no friends found' });
    }

    return res.status(200).json({ user: result.rows });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: 'Error retrieving user data' });
  }
});


// localhost:3000/friends/nick
// get all friends of specific user by username
router.get('/:username', async (req, res) => {

  try {
    const username = req.params.username;

    if (!username) {
      return res.status(400).json({ message: "username is required to get friends" });
    }

    const userId = await getUserId(username, res);
    if (!userId) return;

    const result = await db.query(
      `SELECT u.id, 
      u.username, 
      u.name, 
      u.picture, 
      f.status, 
      f.created,
      CASE 
          WHEN f.user_id = $1 THEN 'sent'
          ELSE 'received'
        END AS direction 
      FROM friends f
      JOIN users u ON u.id =  
      CASE 
        WHEN f.user_id = $1 THEN f.friend_id
        ELSE f.user_id
      END
      WHERE f.user_id = $1 OR f.friend_id = $1
      AND status = 'accepted';`, [userId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: result.rows });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: 'Error retrieving user data' });
  }
});



// Add a friendship request from logged in user to provided user
router.post('/:username', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token
  const username = req.params.username;
  try {

    if (!username) {
      return res.status(400).json({ message: "username is required to add friend" });
    }

    const friendUserIDCheck = await db.query(
      `SELECT id, name, username 
        FROM users 
        WHERE username = $1`, [username]);

    if (friendUserIDCheck.rows.length === 0) {
      return res.status(404).json({ message: `User: ${username} not found` });
    }

    const friendUserId = friendUserIDCheck.rows[0].id;

    // existing entry check:
    if (await doesExist(userId, friendUserId)) {
      return res.status(404).json({ message: 'Friendship already exists' });
    }

    const result = await db.query(`
        INSERT INTO friends 
        (user_id, friend_id)
        VALUES ($1, $2) RETURNING status;`, [userId, friendUserId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "user not found." });
    }


    // send notification if allowed  
    //if (result.rows[0].notifications) {
    const fromName = friendUserIDCheck.rows[0].name ? friendUserIDCheck.rows[0].name + ' (@' + friendUserIDCheck.rows[0].username + ')' : friendUserIDCheck.rows[0].username;
    await createNotification([friendUserId], `${fromName} Wants to be your friend`, `${fromName} has sent you a friend request, accept to become friends`, "/user/friends");
    //}


    res.status(200).json("success");

  } catch (error: any) {
    // Handle duplicate restaurantId error
    if (error.code === "23505") {
      return res.status(409).json({ message: "Restaurant is already added" });
    }

    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Accept a friendship request from provided user
router.post('/:username/accept', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token
  const username = req.params.username;
  try {

    if (!username) {
      return res.status(400).json({ message: "username is required to accept friend request" });
    }

    const requesterId = await getUserId(username, res);
    if (!requesterId) return;

    // existing entry check:
    if (!await isPending(requesterId, userId)) {
      return res.status(404).json({ message: 'Friendship entry does not exist, or friendship is not pending' });
    }

    const result = await db.query(`
          UPDATE friends 
          SET 
              status = 'accepted',  
              updated = NOW()
          WHERE user_id = $1 AND friend_id = $2
          Returning 1;`, [requesterId, userId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Friendship entry does not exist, add user as friend first" });
    }

    res.status(200).json("success");

  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Deny a friendship request from provided user
router.post('/:username/deny', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token
  const username = req.params.username;
  try {

    if (!username) {
      return res.status(400).json({ message: "username is required to deny friend request" });
    }

    const requesterId = await getUserId(username, res);
    if (!requesterId) return;

    // existing entry check:
    if (!await isPending(requesterId, userId)) {
      return res.status(404).json({ message: 'Friendship entry does not exist, or friendship is not pending' });
    }

    const result = await db.query(`
          UPDATE friends 
          SET 
              status = 'declined',  
              updated = NOW()
          WHERE user_id = $1 AND friend_id = $2
          Returning 1;`, [requesterId, userId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Friendship entry does not exist, add user as friend first" });
    }

    res.status(200).json("success");

  } catch (error) {
    console.error("Error denying friend:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Remove a friend (provided user)
router.delete('/:username', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token
  const username = req.params.username;
  try {

    if (!username) {
      return res.status(400).json({ message: "username is required to deny friend request" });
    }

    const requesterId = await getUserId(username, res);
    if (!requesterId) return;

    // existing entry check:
    if (!await doesExist(userId, requesterId)) {
      return res.status(404).json({ message: 'Friendship entry does not exist, add user as friend first' });
    }

    const result = await db.query(`
          DELETE FROM friends
          WHERE (user_id = $1 AND friend_id = $2) 
          OR (friend_id = $1 AND user_id = $2)
          Returning 1;`, [requesterId, userId]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Delete unsuccessful" });
    }

    res.status(200).json("success");

  } catch (error) {
    console.error("Error denying friend:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// determine if user is on friendship
async function doesExist(user_Id: number, friend_id: number): Promise<boolean> {

  const existCheck = await db.query(
    `SELECT status FROM friends
      WHERE (user_id = $1 AND friend_id = $2) OR (friend_id = $1 AND user_id = $2)`, [user_Id, friend_id]);

  if (existCheck.rows.length > 0) {
    return true;
  }
  return false;
}

// determine if friendship is pending
async function isPending(user_Id: number, friend_id: number): Promise<boolean> {

  const existCheck = await db.query(
    `SELECT status FROM friends
      WHERE (user_id = $1 AND friend_id = $2)`, [user_Id, friend_id]);

  if (existCheck.rows.length > 0 && existCheck.rows[0].status == 'pending') {
    return true;
  }
  return false;
}


export default router;