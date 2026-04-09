import express from "express";
import db from "../utils/db";
import authenticate from "../middleware/authenticate";
import createNotification from "../middleware/createNotification";

import { isMod, getUserPermissions, isEmail } from "../utils/util";

const router = express.Router();

import * as dotenv from 'dotenv';
dotenv.config();

// get reports
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const permission = await getUserPermissions(userId);

    if (!permission) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isMod(permission)) {
      return res.status(403).json({ message: "User lacks permissions" });
    }

    const result = await db.query(`
      SELECT 
        *
      FROM contacts
      WHERE (status = 'pending' or status = 'reviewed')
      ORDER BY created DESC
      LIMIT 50;`);

    var contacts = result.rows;

    res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
});


//Get full details for one contact message
router.get('/:contactId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const contactId = req.params.contactId;

    const permission = await getUserPermissions(userId);

    if (!permission) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isMod(permission)) {
      return res.status(403).json({ message: "User lacks permissions" });
    }

    const result = await db.query(`
    SELECT 
        c.*
    FROM contacts c
    JOIN users u ON rep.reporter_id = u.id
    WHERE c.id = $1;`, [contactId]);


    const result2 = await db.query(`
    UPDATE contacts
      SET status = 'reviewed',
          reviewed_by = $1,
          reviewed_at = NOW()
      WHERE id = $2;`, [userId, contactId]);


    const reports = result.rows;

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


//Dismiss reports
router.post('/:id/dismiss', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const id = req.params.id;

    const permission = await getUserPermissions(userId);

    if (!permission) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isMod(permission)) {
      return res.status(403).json({ message: "User lacks permissions" });
    }

    const result = await db.query(`
    UPDATE contacts
      SET status = 'dismissed',
          reviewed_by = $1,
          reviewed_at = NOW()
      WHERE id = $2;`, [userId, id]);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: 'Error Dissmissing contact message' });
  }
});


//resolve reports
router.post('/:id/resolve', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const id = req.params.id;

    const permission = await getUserPermissions(userId);

    if (!permission) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isMod(permission)) {
      return res.status(403).json({ message: "User lacks permissions" });
    }

    const result = await db.query(`
    UPDATE contacts
      SET status = 'resolved',
          reviewed_by = $1,
          reviewed_at = NOW()
      WHERE id = $2;`, [userId, id]);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: 'Error Resolving contact message' });
  }
});



router.post('/', authenticate, async (req, res) => {
  const userId = req.user.userId; // Get user ID from authenticated token
  const { subject, message, reason, email, website } = req.body;

  console.log(req.body);

  if (email && !isEmail(email)) {
    return res.status(400).json({ error: "invalid email" });
  }

  // honey pot 
  if (website && website.trim() !== "") {
    // Probably a bot.
    console.error("Bot detected");
    // give fake response 
    return res.status(201).json({ message: 'Message submitted' });
  }

  //Validate reason
  const validReasons = [
    'general', 'account', 'bug', 'owner',
    'feature', 'report', 'billing', 'partnership', 'other'
  ];

  if (!validReasons.includes(reason)) {
    return res.status(400).json({ error: 'Invalid reason' });
  }

  try {
    //Insert contact message
    await db.query(
      `INSERT INTO contacts 
       (subject, message, reason, email)
       VALUES ($1, $2, $3, $4);`,
      [subject, message, reason, email]
    );

    return res.status(201).json({ message: 'Message submitted' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});


//module.exports = router;
export default router;