import express from "express";
import db from "../utils/db";
import authenticate from "../middleware/authenticate";
import { isMod, getUserPermissions } from "../utils/util";

const router = express.Router();

// localhost:3000/categories
// get all the categories
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(`SELECT id,name,slug FROM categories`);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "categories not found." });
    }

    res.status(200).json({ categories: result.rows });

  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// localhost:3000/categories/0
// get specific category
router.get('/:categoryId', async (req, res, next) => {
  const categoryId = parseInt(req.params.categoryId);

  try {
    const result = await db.query(
      `SELECT * FROM categories
           WHERE id = $1`, [categoryId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "category not found." });
    }

    res.status(200).json({ categories: result.rows[0] });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});



// localhost:3000/categories
// create a category
router.post('/', authenticate, async (req, res, next) => {
  const userId = req.user.userId; // Get user ID from authenticated token
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "name and description are required fields" });
  }
  try {

    const permission = await getUserPermissions(userId);

    if (!permission) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!isMod(permission)) {
      return res.status(403).json({ message: "User lacks permissions" });
    }


    const result = await db.query(`
        INSERT INTO categories
        (name, description, created)
        VALUES ($1, $2, NOW()) RETURNING *;`, [name, description]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "categories not found." });
    }

    res.status(201).json({ message: "category created successfully", category: result.rows[0] });
  } catch (error:any) {
    // Handle duplicate category error
    if (error.code === "23505") {
      return res.status(409).json({ message: "Category already exists" });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//module.exports = router;
export default router;