import express from "express";
import fs from "fs";
import * as path from "path";

import db from "../utils/db";
import authenticate from "../middleware/authenticate";
import createNotification from "../middleware/createNotification";

import { getUserPermissions, isBanned, isMod } from "../utils/util";

const router = express.Router();

import * as dotenv from 'dotenv';
import requirePermission from "../middleware/requirePermission";
dotenv.config();


// get logged in users reviews
router.get('/', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  const page = Number(req.query.page) || 1;
  var pageSize = Number(req.query.pageSize) || 10;
  if (pageSize && pageSize > 100) {
    pageSize = 100;
  }
  const offset = (page - 1) * pageSize;

  try {
    const result = await db.query(`
      SELECT r.id, r.restaurant_id, r.liked, r.visited, r.score, r.description, r.updated, r.created, u.name, u.username, u.picture 
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1
      ORDER BY r.created DESC
      LIMIT $2 OFFSET $3;`, [userId, pageSize, offset]);

    const countResult = await db.query(`
      SELECT COUNT(*) AS total 
      FROM reviews 
      WHERE user_id = $1;`, [userId]);

    const totalReviews = parseInt(countResult.rows[0].total, 10);

    res.json({
      page, pageSize, totalReviews, reviews: result.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})


// get logged in users reviews
router.get('/:username', async (req, res, next) => {

  const username = req.params.username;

  const restaurantId = req.query.restaurant || null;
  const page = Number(req.query.page) || 1;
  var pageSize = Number(req.query.pageSize) || 10;
  if (pageSize && pageSize > 100) {
    pageSize = 100;
  }
  const offset = (page - 1) * pageSize;

  try {

    const userResult = await db.query(`
      SELECT id 
      FROM users 
      WHERE username = $1;`, [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    let result;
    let countResult;

    if (restaurantId) {

      result = await db.query(`
      SELECT r.id, r.restaurant_id, r.liked, r.visited, r.score, r.description, r.updated, r.created, u.name, u.username, u.picture
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1 AND r.restaurant_id = $2
      ORDER BY r.created DESC
      LIMIT $3 OFFSET $4;`, [userId, restaurantId, pageSize, offset]);

      countResult = await db.query(`
      SELECT COUNT(*) AS total 
      FROM reviews 
      WHERE user_id = $1 AND restaurant_id = $2;`, [userId, restaurantId]);

    } else {
      result = await db.query(`
      SELECT r.id, r.restaurant_id, r.liked, r.visited, r.score, r.description, r.updated, r.created, u.name, u.username, u.picture, res.name AS restaurant_name, res.pictures, res.type, res.slug
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN restaurants res ON r.restaurant_id = res.id 
      WHERE r.user_id = $1 
      ORDER BY r.created DESC
      LIMIT $2 OFFSET $3;`, [userId, pageSize, offset]);

      countResult = await db.query(`
      SELECT COUNT(*) AS total 
      FROM reviews 
      WHERE user_id = $1;`, [userId]);
    }

    const totalReviews = parseInt(countResult.rows[0].total, 10);

    res.json({
      page, pageSize, totalReviews, reviews: result.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})


// localhost:3000/reviews/restaurants/0?page=1&pageSize=10
router.get('/restaurants/:restaurantId', async (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  const page = Number(req.query.page) || 1;
  var pageSize = Number(req.query.pageSize) || 10;
  if (pageSize && pageSize > 100) {
    pageSize = 100;
  }
  const offset = (page - 1) * pageSize;

  try {
    const result = await db.query(`
      SELECT r.id, r.restaurant_id, r.liked, r.visited, r.score, r.description, r.updated, r.created, u.name, u.username, u.picture 
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.restaurant_id = $1 AND r.visited = TRUE
      ORDER BY r.created DESC
      LIMIT $2 OFFSET $3;`, [restaurantId, pageSize, offset]);

    const countResult = await db.query(`
      SELECT COUNT(*) AS total 
      FROM reviews 
      WHERE restaurant_id = $1 AND r.visited = TRUE`, [restaurantId]);

    const totalReviews = parseInt(countResult.rows[0].total, 10);

    res.json({
      page, pageSize, totalReviews, reviews: result.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/', authenticate, requirePermission(), async (req, res) => {

  const { restaurant_id, liked, visited, score, description } = req.body;
  const userId = req.user.userId; // Get user ID from authenticated token

  if (!restaurant_id) {
    return res.status(400).json({ message: "restaurant_id is required" });
  }
  // make sure score is within bounds
  let fixedScore = score;
  if(fixedScore > 10)
    fixedScore = 10;

  if(fixedScore < 0)
    fixedScore = 0;

  try {

    const result = await db.query(
      `INSERT INTO reviews (restaurant_id, user_id, liked, visited, score, description) 
                VALUES ($1, $2, COALESCE($3, false), COALESCE($4, false), COALESCE($5, 0), $6) RETURNING *`,
      [restaurant_id, userId, liked, visited, fixedScore, description]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error });
  }

});


//module.exports = router;
export default router;