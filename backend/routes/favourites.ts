import express from "express";
import db from "../utils/db";
import createNotification from "../middleware/createNotification";
import authenticate from "../middleware/authenticate";
import { getUserId } from "../utils/util";

const router = express.Router();


// get logged in users favourite restaurant
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
  
    const result = await db.query(
        `SELECT r.id, r.name, r.pictures FROM favorite_restaurant fr
        JOIN restaurants r ON fr.restaurant_id = r.id
        WHERE fr.user_id = $1`, [userId]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No favourited restaurants' });
    }

    res.status(200).json({ favourites: result.rows, totalFavourites: result.rows.length });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


// get logged in user entry for specific restaurant
router.get('/restaurants/:restaurant_id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const restaurant_id = req.params.restaurant_id;

    const result = await db.query(
        `SELECT r.id, r.name, r.pictures FROM favorite_restaurant fr
        JOIN restaurants r ON fr.restaurant_id = r.id
        WHERE fr.user_id = $1 AND fr.restaurant_id = $2`, [userId, restaurant_id]);
   
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No favourited restaurants' });
    }

    res.status(200).json({ favourites: result.rows, totalFavourites: result.rows.length });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


// localhost:3000/favourites
// get users favourites
router.get('/:username', async (req, res, next) => {
  try {

    const username = req.params.username;

    if (!username) {
      return res.status(400).json({ message: 'username required field' });
    }

    const userId = await getUserId(username, res);
    if (!userId) return;

    const result = await db.query(
        `SELECT r.id, r.name, r.pictures FROM favorite_restaurant fr
        JOIN restaurants r ON fr.restaurant_id = r.id
        WHERE fr.user_id = $1`, [userId]);

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
router.post('/:restaurant_id', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    const restaurantId = parseInt(req.params.restaurant_id);

    const count = await db.query(
      `SELECT COUNT(fr.*) FROM favorite_restaurant fr
        WHERE fr.user_id = $1`, [userId]);

    const amount = count.rows[0].count;

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

  } catch (error: any) {
    // Handle duplicate restaurantId error
    if (error.code === "23505") {
      return res.status(409).json({ message: "Restaurant is already added" });
    }

    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// remove a favourites restaurant to logged in user
router.delete('/:restaurant_id', authenticate, async (req, res, next) => {

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

//module.exports = router;
export default router;
