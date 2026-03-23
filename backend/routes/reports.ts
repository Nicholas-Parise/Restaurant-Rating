import express from "express";
import fs from "fs";
import * as path from "path";

import db from "../utils/db";
import authenticate from "../middleware/authenticate";
import createNotification from "../middleware/createNotification";

import { isBanned, isMod, deleteImage } from "../utils/util";

const router = express.Router();

import * as dotenv from 'dotenv';
dotenv.config();

// get reports
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    if (!(await isMod(userId, res))) return;

    const result = await db.query(`
      SELECT 
        target_type,
        target_id,
        COUNT(*) AS report_count,
        MAX(created) AS last_reported_at
      FROM reports
      WHERE status = 'pending'
      GROUP BY target_type, target_id
      ORDER BY report_count DESC, last_reported_at DESC
      LIMIT 50;`);

    var reports = result.rows;

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


//Get full details for one reported review
//Get all report messages for that review
router.get('/review/:reviewId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const reviewId = req.params.reviewId;

    if (!(await isMod(userId, res))) return;

    const result = await db.query(`
    SELECT 
        rep.reason,
        rep.description,
        rep.created,
        u.username AS reporter
    FROM reports rep
    JOIN users u ON rep.reporter_id = u.id
    WHERE rep.target_type = 'review'
      AND rep.target_id = $1
    ORDER BY rep.created DESC;`, [reviewId]);


    const result2 = await db.query(
      `SELECT 
        r.id,
        r.description,
        r.score,
        r.created,
        u.username,
        COUNT(rep.id) AS report_count
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    LEFT JOIN reports rep 
        ON rep.target_type = 'review' 
        AND rep.target_id = r.id
    WHERE r.id = $1
    GROUP BY r.id, u.username;`, [reviewId]);


    const reports = result.rows;
    const review = result2.rows[0];

    res.status(200).json({ reports, review });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


//Get full details for one reported user
//Get all report messages for that user
router.get('/user/:userReportId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const userReportId = req.params.userReportId;

    if (!(await isMod(userId, res))) return;

    const result = await db.query(`
    SELECT 
        rep.reason,
        rep.description,
        rep.created,
        u.username AS reporter
    FROM reports rep
    JOIN users u ON rep.reporter_id = u.id
    WHERE rep.target_type = 'user'
      AND rep.target_id = $1
    ORDER BY rep.created DESC;`, [userReportId]);

    const result2 = await db.query(
      `SELECT 
        u.id,
        u.username,
        u.name,
        u.bio,
        u.picture
        COUNT(rep.id) AS report_count
    FROM users u
    LEFT JOIN reports rep 
        ON rep.target_type = 'user' 
        AND rep.target_id = u.id
    WHERE u.id = $1
    GROUP BY u.username;`, [userReportId]);


    const reports = result.rows;
    const user = result2.rows[0];

    res.status(200).json({ reports, user });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});

//Dismiss reports
router.post('/:type/:id/dismiss', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const type = req.params.type;
    const id = req.params.id;

     if (!(await isMod(userId, res))) return;

    const result = await db.query(`
    UPDATE reports
      SET status = 'dismissed',
          reviewed_by = $1,
          reviewed_at = NOW()
      WHERE target_type = $2
        AND target_id = $3
        AND status = 'pending';`, [userId, type, id]);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});



// Remove review (and resolve reports)
router.post('/review/:id/remove', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const id = req.params.id;

     if (!(await isMod(userId, res))) return;

    const result = await db.query(`
    BEGIN;

    DELETE FROM reviews
    WHERE id = $1;

    UPDATE reports
    SET status = 'resolved',
        reviewed_by = $2,
        reviewed_at = NOW()
    WHERE target_type = 'review'
      AND target_id = $1;

    COMMIT;`, [id, userId ]);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


// Ban / restrict user
router.post('/user/:id/ban', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const id = req.params.id;

    if (!(await isMod(userId, res))) return;

    const result = await db.query(`
    BEGIN;

    UPDATE users
    SET 
      permissions = 'banned',
      name = 'Banned User',
      bio = 'Your account has been temporarily banned for breaking TOS',
      updated = NOW()
    WHERE id = $1;

    UPDATE reports
    SET status = 'resolved',
        reviewed_by = $2,
        reviewed_at = NOW()
    WHERE target_type = 'user'
      AND target_id = $1;

    COMMIT;`, [id, userId ]);


    const user = await db.query("SELECT picture FROM users WHERE id = $1", [id]);
    const picture = user.rows[0].picture;
    await deleteImage(picture);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


router.post('/', authenticate, async (req, res) => {
  const userId = req.user.userId; // Get user ID from authenticated token
  const { target_type, target_id, reason, description } = req.body;

  // 1. Validate target_type
  if (!['review', 'user'].includes(target_type)) {
    return res.status(400).json({ error: 'Invalid target_type' });
  }

  // 2. Validate reason
  const validReasons = [
    'spam', 'harassment', 'hate', 'nudity', 
    'violence', 'misinformation', 'other'
  ];

  if (!validReasons.includes(reason)) {
    return res.status(400).json({ error: 'Invalid reason' });
  }

  try {
    // 3. Prevent self-reporting (optional but recommended)
    if (target_type === 'user' && target_id === userId) {
      return res.status(400).json({ error: 'Cannot report yourself' });
    }

    // 4. Check target exists
    let existsQuery;
    if (target_type === 'review') {
      existsQuery = await db.query(
        'SELECT id FROM reviews WHERE id = $1',
        [target_id]
      );
    } else {
      existsQuery = await db.query(
        'SELECT id FROM users WHERE id = $1',
        [target_id]
      );
    }

    if (existsQuery.rowCount === 0) {
      return res.status(404).json({ error: 'Target not found' });
    }

    // 5. Insert report (handles duplicate via constraint)
    await db.query(
      `INSERT INTO reports 
       (reporter_id, target_type, target_id, reason, description)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (reporter_id, target_type, target_id) DO NOTHING`,
      [userId, target_type, target_id, reason, description || null]
    );

    return res.status(201).json({ message: 'Report submitted' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});




//module.exports = router;
export default router;