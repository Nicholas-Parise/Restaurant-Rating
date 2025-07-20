const express = require('express');
const router = express.Router();
const db = require('./db');
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcryptjs");

require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const authenticate = require('./middleware/authenticate');
const uploadPicture = require('./middleware/upload');

// localhost:3000/users
// get logged in users
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const result = await db.query('SELECT id, username, email, name, bio, picture, pro, setup, notifications, created, updated, (google_id IS NOT NULL) AS oauth FROM users WHERE id = $1', [userId]);

    const result2 = "null"/*await db.query(
      `SELECT c.*, uc.love FROM categories c
        JOIN user_categories uc ON c.id = uc.category_id
        WHERE uc.user_id = $1`, [userId]);
*/
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: result.rows[0], categories: result2.rows });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


// localhost:3000/users
// Update logged-in user's profile
router.put('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const { email, name, password, newPassword, bio, notifications, setup } = req.body;
    let newHashedPassword;
    let newEmail;

    // Type checking
    if (email !== undefined && typeof email !== "string") {
      return res.status(400).json({ error: "email must be a string" });
    }
    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({ error: "name must be a string" });
    }
    if (password !== undefined && typeof password !== "string") {
      return res.status(400).json({ error: "password must be a string" });
    }
    if (newPassword !== undefined && typeof newPassword !== "string") {
      return res.status(400).json({ error: "newPassword must be a string" });
    }
    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({ error: "bio must be a string" });
    }
    if (notifications !== undefined && typeof notifications !== "boolean") {
      return res.status(400).json({ error: "notifications must be a boolean" });
    }
    if (setup !== undefined && typeof setup !== "boolean") {
      return res.status(400).json({ error: "setup must be a boolean" });
    }

    // if user sends a new password, make sure they supply their old password and it is correct.
    if (newPassword || email) {
      if (!password) {
        return res.status(400).json({ message: "Current password is required to change password or email" });
      }

      // Get the user's stored hashed password
      const userResult = await db.query("SELECT password,(google_id IS NOT NULL) AS oauth FROM users WHERE id = $1", [userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "user not found" });
      }

      if (userResult.rows.oauth) {
        return res.status(403).json({ message: "email and/or password cannot be changed with an oauth user" });
      }

      const hashedPassword = userResult.rows[0].password;

      // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        return res.status(403).json({ message: "Incorrect password" });
      }

      if (newPassword) {
        newHashedPassword = await bcrypt.hash(newPassword, 10); // make new password
      }
      if (email) {
        newEmail = email;
      }
    }

    const result = await db.query(`
          UPDATE users 
          SET 
              name = COALESCE($1, name),  
              password = COALESCE($2, password),
              email = COALESCE($3, email),
              bio = COALESCE($4, bio),
              notifications = COALESCE($5, notifications),
              setup = COALESCE($6, setup),
              updated = NOW()
          WHERE id = $7
          RETURNING id, email, name, bio, notifications, setup, created, updated;`, [name, newHashedPassword, newEmail, bio, notifications, setup, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user: result.rows[0] });

  } catch (error) {

    // Handle duplicate email error
    // error code 23505 means unique constraint violated.
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email is already in use" });
    }

    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
});


// localhost:3000/users
// Delete logged-in user's account
router.delete('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required to delete account" });
    }

    // Get the user's stored hashed password
    const userResult = await db.query("SELECT password,(google_id IS NOT NULL) AS oauth, pro, stripe_subscription_id FROM users WHERE id = $1", [userId]);

    const user = userResult.rows[0];

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }

    if (user.oauth) {
      // remove their autopayment
      if (user.pro) {
        if (user.stripe_subscription_id) {
          await stripe.subscriptions.cancel(user.stripe_subscription_id);
        }
      }
      await deleteImage(userId);
      await db.query("DELETE FROM users WHERE id = $1", [userId]);
      return res.status(200).json({ message: "OAuth account deleted successfully" });
    }


    const hashedPassword = user.password;

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    // Delete the users profile picture
    await deleteImage(userId);

    // remove their autopayment
    if (user.pro) {
      if (user.stripe_subscription_id) {
        await stripe.subscriptions.cancel(user.stripe_subscription_id);
      }
    }

    // Delete user if password is correct
    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    return res.status(200).json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting account" });
  }
});


// localhost:3000/users
// get logged in users
router.get('/recent', async (req, res, next) => {
  try {
    const username = req.query.username;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;


    if (!username) {
      return res.status(400).json({ message: 'username required field' });
    }

    const tempUserId = await db.query(
      `SELECT id FROM users Where username = $1`, [username]);

    if (tempUserId.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = tempUserId.rows[0].id;

    const result = await db.query(
      `SELECT r.id, r.name, r.pictures FROM reviews rev
        JOIN restaurants r ON rev.restaurant_id = r.id
        WHERE rev.user_id = $1
        ORDER BY rev.created DESC
        LIMIT $2 OFFSET $3;`, [userId, pageSize, offset]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No recents' });
    }

    res.status(200).json({ recents: result.rows, totalrecents: result.rows.length });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});



// localhost:3000/users
// get users favourites
router.get('/favourites', async (req, res, next) => {
  try {
    const restaurant = parseInt(req.query.restaurant);
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'username required field' });
    }

    const tempUserId = await db.query(
      `SELECT id FROM users Where username = $1`, [username]);

    if (tempUserId.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = tempUserId.rows[0].id;

    let result;

    if (restaurant) {
      result = await db.query(
        `SELECT r.id, r.name, r.pictures FROM favorite_restaurant fr
        JOIN restaurants r ON fr.restaurant_id = r.id
        WHERE fr.user_id = $1 AND fr.restaurant_id = $2`, [userId, restaurant]);
    } else {
      result = await db.query(
        `SELECT r.id, r.name, r.pictures FROM favorite_restaurant fr
        JOIN restaurants r ON fr.restaurant_id = r.id
        WHERE fr.user_id = $1`, [userId]);
    }


    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No favourites' });
    }

    res.status(200).json({ favourites: result.rows, totalFavourites: result.rows.length });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});



// Add a favourites restaurant to logged in user
router.post('/favourites/:restaurant_id', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    const restaurantId = parseInt(req.params.restaurant_id);

    const count = await db.query(
      `SELECT COUNT(fr.*) FROM favorite_restaurant fr
        WHERE fr.user_id = $1`, [userId]);

    const amount = count.rows[0].count;

    console.log(count.rows[0].count);

    if (amount >= 4) {
      return res.status(403).json({ error: "only 4 favourites allowed." });
    }


    const result = await db.query(`
        INSERT INTO favorite_restaurant 
        (user_id, restaurant_id)
        VALUES ($1, $2) RETURNING restaurant_id;`, [userId, restaurantId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "restaurant not found." });
    }

    res.status(200).json("success");

  } catch (error) {
    // Handle duplicate restaurantId error
    if (error.code === "23505") {
      return res.status(409).json({ message: "Restaurant is already added" });
    }

    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// remove a favourites restaurant to logged in user
router.delete('/favourites/:restaurant_id', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    const restaurantId = parseInt(req.params.restaurant_id);

    await db.query("DELETE FROM favorite_restaurant WHERE user_id = $1 AND restaurant_id = $2", [userId, restaurantId]);

    res.status(200).json("success");

  } catch (error) {
    console.error("Error removing restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/users
// get logged in users bookmarked restaurant
router.get('/bookmarks', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const restaurant = parseInt(req.query.restaurant);

    let result;

    if (restaurant) {
      result = await db.query(
        `SELECT r.id, r.name, r.pictures FROM bookmarked_restaurant br
        JOIN restaurants r ON br.restaurant_id = r.id
          WHERE br.user_id = $1 AND br.restaurant_id = $2`, [userId, restaurant]);
    } else {
      result = await db.query(
        `SELECT r.id, r.name, r.pictures FROM bookmarked_restaurant br
        JOIN restaurants r ON br.restaurant_id = r.id
        WHERE br.user_id = $1`, [userId]);
    }


    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No bookmarked restaurants' });
    }

    res.status(200).json({ bookmarked: result.rows, totalBookmarked: result.rows.length });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


// Add a bookmarked restaurant to logged in user
router.post('/bookmarks/:restaurant_id', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    const restaurantId = parseInt(req.params.restaurant_id);

    const result = await db.query(`
        INSERT INTO bookmarked_restaurant 
        (user_id, restaurant_id)
        VALUES ($1, $2) RETURNING restaurant_id;`, [userId, restaurantId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "restaurant not found." });
    }

    res.status(200).json("success");

  } catch (error) {
    // Handle duplicate restaurantId error
    if (error.code === "23505") {
      return res.status(409).json({ message: "Restaurant is already added" });
    }

    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// remove a bookmarked restaurant to logged in user
router.delete('/bookmarks/:restaurant_id', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    const restaurantId = parseInt(req.params.restaurant_id);

    await db.query("DELETE FROM bookmarked_restaurant WHERE user_id = $1 AND restaurant_id = $2", [userId, restaurantId]);

    res.status(200).json("success");

  } catch (error) {
    console.error("Error removing restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// localhost:3000/users/friends/nick
// get all friends of specific user by username
router.get('/friends/:username', async (req, res) => {

  try {
    const username = req.params.username;

    if (!username) {
      return res.status(400).json({ message: "username is required to get friends" });
    }

    const userIDCheck = await db.query(
      `SELECT id 
        FROM users 
        WHERE username = $1`, [username]);

    if (userIDCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userIDCheck.rows[0].id;

    const result = await db.query(
      `SELECT u.id, u.username, u.name, u.picture, f.created 
      FROM friends f
      JOIN users u ON u.id =  
      CASE 
        WHEN f.user_id = $1 THEN f.friend_id
        ELSE f.user_id
      END
      WHERE f.user_id = $1 OR f.friend_id = $1`, [userId]);


    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: result.rows[0], categories: result2.rows });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: 'Error retrieving user data' });
  }
});



// Add a friendship request from logged in user to provided user
router.post('/friends/:username', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token
  const username = req.params.username;
  try {

    if (!username) {
      return res.status(400).json({ message: "username is required to add friend" });
    }

    const friendUserIDCheck = await db.query(
      `SELECT id 
        FROM users 
        WHERE username = $1`, [username]);

    if (friendUserIDCheck.rows.length === 0) {
      return res.status(404).json({ message: `User: ${username} not found` });
    }

    const friendUserId = friendUserIDCheck.rows[0].id;

    // existing entry check:

    const existCheck = await db.query(
      `SELECT status FROM friends
      WHERE (user_id = $1 AND friend_id = $2) OR (friend_id = $1 AND user_id = $2)`, [userId, friendUserId]);

    if (existCheck.rows.length > 0) {   
      return res.status(400).json({ message: `friendship already exists, and you are ${existCheck.rows[0].status}` });
    }


    const result = await db.query(`
        INSERT INTO friends 
        (user_id, friend_id)
        VALUES ($1, $2) RETURNING status;`, [userId, friendUserId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "user not found." });
    }

    res.status(200).json("success");

  } catch (error) {
    // Handle duplicate restaurantId error
    if (error.code === "23505") {
      return res.status(409).json({ message: "Restaurant is already added" });
    }

    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.get('/search', async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const searchTerm = req.query.q;
  const offset = (page - 1) * pageSize;
  var result;

  if (pageSize && pageSize > 100) {
    pageSize = 100;
  }

  try {
    if (!searchTerm) {
    return res.status(400).json({ message: "search is required" });
    }
      console.log(searchTerm);

        result = await db.query(
          `SELECT *, COUNT(*) OVER() AS total_count 
          FROM (
          SELECT id, username, name, picture, GREATEST(similarity(username, $1), similarity(name, $1)) AS sim
          FROM users
          WHERE username % $1 OR name % $1
          ) sub
          ORDER BY sim DESC
          LIMIT $2 OFFSET $3;`, [searchTerm, pageSize, offset]);
    
    const users = result.rows;
    
    const total = users[0]?.total_count ?? 0;

    res.json({
      page,
      pageSize,
      totalUsers: total,
      users: users,
    });


  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});




// localhost:3000/users/0
// get specific user by username
router.get('/:userId', async (req, res) => {

  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "username is required to get account" });
    }

    const result = await db.query('SELECT username, name, bio, picture, notifications, pro, created FROM users WHERE username = $1', [userId]);
    const result2 = "null"
    /*await db.query(
      `SELECT c.*, uc.love FROM categories c
        JOIN user_categories uc ON c.id = uc.category_id
        WHERE uc.user_id = $1`, [userId]);
*/
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: result.rows[0], categories: result2.rows });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: 'Error retrieving user data' });
  }
});












// localhost:3000/users/upload-profile
// upload new profile picture
router.post('/upload', authenticate, uploadPicture, async (req, res) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = `/uploads/users/${req.file.filename}`; // get file name from file

  try {

    await deleteImage(userId);

    await db.query("UPDATE users SET picture = $1 WHERE id = $2", [filePath, userId]);

    res.json({ message: "Profile picture updated!", imageUrl: `http://wishify.ca${filePath}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Delete the old profile picture off of server
async function deleteImage(userId) {

  //get the file name
  const user = await db.query("SELECT picture FROM users WHERE id = $1", [userId]);

  const filePath = user.rows[0].picture;

  // if the file is not null and is different that default
  if (filePath && filePath !== "/assets/placeholder-avatar.png") {
    const oldPicPath = path.join(__dirname, '.', filePath);
    if (fs.existsSync(oldPicPath)) {
      console.log("deleting this file: " + oldPicPath);
      fs.unlinkSync(oldPicPath);
    } else {
      console.log("Old picture file does not exist:", oldPicPath);
    }
  }
}


module.exports = router;
