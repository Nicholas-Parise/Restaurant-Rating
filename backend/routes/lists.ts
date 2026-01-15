import express from "express";
import db from "../utils/db";
import createNotification from "../middleware/createNotification";
import authenticate from "../middleware/authenticate";
import { getUserId, maxString } from "../utils/util";

const router = express.Router();

// localhost:3000/lists
// get logged in users lists
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const result = await db.query(
      `SELECT *, COUNT(*) OVER() AS total_count 
        FROM (
          SELECT li.id, li.name, li.description, li.created, u.name AS owner_name, u.username AS owner_username
          FROM lists li 
          JOIN users u ON u.id = li.user_id
          WHERE li.user_id = $1
          ORDER BY created DESC 
        ) sub
          LIMIT $2 OFFSET $3;`, [userId, pageSize, offset]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No lists' });
    }

    const lists = result.rows;
    const totalLists = lists[0]?.total_count ?? 0;

    res.status(200).json({ lists, totalLists, page, pageSize });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});


// TODO impliment later
router.get('/recommended', async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const result = await db.query(
      `SELECT *, COUNT(*) OVER() AS total_count 
      FROM (
        SELECT li.id, li.name, li.description, li.created, u.name AS owner_name, u.username AS owner_username
        FROM lists li 
        JOIN users u ON u.id = li.user_id
      ) sub
      LIMIT $1 OFFSET $2;`, [pageSize, offset]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No lists' });
    }

    const lists = result.rows;
    const totalLists = lists[0]?.total_count ?? 0;

    res.status(200).json({ lists, totalLists, page, pageSize });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});




// localhost:3000/lists/user
// get provided users lists
router.get('/users/:username', async (req, res, next) => {
  try {

    const username: string = req.params.username;

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    if (!username) {
      return res.status(400).json({ message: "username is required to get bookmarks" });
    }

    const userId = await getUserId(username, res);
    if (!userId) return;

    const result = await db.query(
      `SELECT *, COUNT(*) OVER() AS total_count 
      FROM (
        SELECT li.id, li.name, li.description, li.created, u.name AS owner_name, u.username AS owner_username
        FROM lists li 
        JOIN users u ON u.id = li.user_id
        WHERE li.user_id = $1
      ) sub
      LIMIT $2 OFFSET $3;`, [userId, pageSize, offset]);


    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No lists' });
    }

    const lists = result.rows;
    const totalLists = lists[0]?.total_count ?? 0;

    res.status(200).json({ lists, totalLists, page, pageSize });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});



router.get('/search', async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  let pageSize = parseInt(req.query.pageSize) || 10;
  const searchTerm = req.query.q;
  const offset = (page - 1) * pageSize;

  if (pageSize && pageSize > 100) {
    pageSize = 100;
  }

  try {
    if (!searchTerm) {
      return res.status(400).json({ message: "query is required" });
    }
    console.log(searchTerm);

    const result = await db.query(
      `SELECT *, COUNT(*) OVER() AS total_count 
          FROM (
            SELECT li.id, li.name, li.description, li.created, u.name AS owner_name, u.username AS owner_username, GREATEST(similarity(li.name, $1), similarity(li.description, $1)) AS sim
            FROM lists li 
            JOIN users u ON u.id = li.user_id
            WHERE li.name % $1 OR li.description % $1
          ) sub
          ORDER BY sim DESC
          LIMIT $2 OFFSET $3;`, [searchTerm, pageSize, offset]);

    const lists = result.rows;
    const totalLists = lists[0]?.total_count ?? 0;

    res.json({
      lists, totalLists, page, pageSize
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});




// localhost:3000/lists/user
// get specific list entry 
router.get('/:id', async (req, res, next) => {
  try {

    const list_id: number = req.params.id;

    const result = await db.query(
      `SELECT li.id, li.name, li.description, li.created, u.name AS owner_name, u.username AS owner_username
      FROM lists li 
      JOIN users u ON u.id = li.user_id
      WHERE li.id = $1;`, [list_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'List not found' });
    }

    const res_result = await db.query(
      `SELECT r.id, r.name, r.pictures
      FROM restaurants r
      JOIN listed_restaurants lr ON lr.restaurant_id = r.id
      WHERE lr.list_id = $1;`, [list_id]);

    res.status(200).json({ lists: result.rows, restaurants: res_result.rows });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
});




// create a list
router.post('/', authenticate, async (req, res, next) => {

  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    let { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required." });
    }

    name = maxString(name, 50);
    description = maxString(description, 200);

    const result = await db.query(`
        INSERT INTO lists 
        (user_id, name, description)
        VALUES ($1, $2, $3) RETURNING *;`, [userId, name, description]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user_result = await db.query(
      `SELECT name AS owner_name, username AS owner_username
      FROM users 
      WHERE id = $1;`, [userId]);

    var temp = result.rows[0];
    var usr_temp = user_result.rows[0];

    const list = {...temp, ...usr_temp};

    res.status(200).json({ list, message: "success" });

  } catch (error: any) {
    console.error("Error creating List:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// edit a list
router.put('/:list_id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticated token
    const list_id = parseInt(req.params.list_id);
    let { name, description } = req.body;

    if (!await isOwner(userId, list_id)) {
      return res.status(403).json({ error: "must own list." });
    }

    name = maxString(name, 50);
    description = maxString(description, 200);

    const result = await db.query(`
        UPDATE lists 
        SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          updated = NOW()
        WHERE user_id = $3 AND id = $4 RETURNING *;`, [name, description, userId, list_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "restaurant not found." });
    }

    res.status(200).json({ list: result.rows[0], message: "success" });

  } catch (error: any) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// add restaurant to a list
router.post('/:list_id/:restaurant_id', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    const restaurantId = parseInt(req.params.restaurant_id);
    const list_id = parseInt(req.params.list_id);

    if (!await isOwner(userId, list_id)) {
      return res.status(403).json({ error: "must own list." });
    }

    const result = await db.query(`
        INSERT INTO listed_restaurants 
        (list_id, restaurant_id, priority)
        VALUES ($1, $2, 0) RETURNING restaurant_id;`, [list_id, restaurantId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "list or restaurant not found." });
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


// remove a restaurant from a list
router.delete('/:list_id/:restaurant_id', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    const restaurant_id = parseInt(req.params.restaurant_id);
    const list_id = parseInt(req.params.list_id);

    if (!await isOwner(userId, list_id)) {
      return res.status(403).json({ error: "must own list." });
    }

    await db.query("DELETE FROM listed_restaurants WHERE list_id = $1 AND restaurant_id = $2", [list_id, restaurant_id]);

    res.status(200).json("success");

  } catch (error) {
    console.error("Error removing restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// delete a list
router.delete('/:list_id', authenticate, async (req, res, next) => {

  const userId = req.user.userId; // Get user ID from authenticated token

  try {
    const list_id = parseInt(req.params.list_id);

    if (!await isOwner(userId, list_id)) {
      return res.status(403).json({ error: "must own list." });
    }
    // delete cascade
    await db.query(`DELETE FROM lists WHERE id = $1 AND user_id = $2;`, [list_id, userId]);

    res.status(200).json("success");

  } catch (error) {
    console.error("Error removing restaurant:", error);
     await db.query("ROLLBACK");
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// determine if user owns list
async function isOwner(user_Id: number, list_id: number): Promise<boolean> {

  const result = await db.query("SELECT 1 FROM lists WHERE user_id = $1 AND id = $2", [user_Id, list_id]);

  if (result.rows.length > 0) {
    return true;
  }
  return false;
}


//module.exports = router;
export default router;