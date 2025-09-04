const express = require('express');
const router = express.Router();
const db = require('../utils/db');

require("dotenv").config();

const createNotification = require("../middleware/createNotification");
const authenticate = require('../middleware/authenticate');

// localhost:3000/users
// get logged in users bookmarked restaurant
router.get('/', authenticate, async (req, res, next) => {
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


// localhost:3000/users
// get provided users bookmarked restaurant
router.get('/:username', async (req, res, next) => {
  try {

    const username = req.params.username;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    if (!username) {
      return res.status(400).json({ message: "username is required to get bookmarks" });
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
      `SELECT r.id, r.name, r.pictures FROM bookmarked_restaurant br
      JOIN restaurants r ON br.restaurant_id = r.id
      WHERE br.user_id = $1
      LIMIT $2 OFFSET $3;`, [userId, pageSize, offset]);


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
router.post('/:restaurant_id', authenticate, async (req, res, next) => {

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
router.delete('/:restaurant_id', authenticate, async (req, res, next) => {

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


module.exports = router;
