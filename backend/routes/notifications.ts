import express from "express";
import db from "../utils/db";
import authenticate from "../middleware/authenticate";

const router = express.Router();

// localhost:3000/notifications?page=1&pageSize=10
// get all your notifications
router.get('/', authenticate, async (req, res, next) => {
  const userId = req.user.userId; // Get user ID from authenticated token
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  
  try {

    const result = await db.query(
      `SELECT id, title, body, url, is_read, created 
      FROM notifications 
      WHERE user_id = $1 
      ORDER BY created DESC
      LIMIT $2 OFFSET $3;`, [userId, pageSize, offset]);
    
    return res.status(200).json({notifications: result.rows});

  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// localhost:3000/notifications/0
// edit a notifications
router.put('/:id', authenticate, async (req, res, next) => {

  const notificationId = parseInt(req.params.id);
  const is_read:boolean|null = req.body.is_read;
  const userId = req.user.userId; // Get user ID from authenticated token

 if (!is_read) {
    return res.status(400).json({ error: "is_read is required" });
  }

  try {

    if (!await isOwner(userId, notificationId)) {
      return res.status(403).json({ error: "You do not have permission to edit this notification" });
    }

    // Update the notifications with provided values
    const result = await db.query(`
        UPDATE notifications
        SET 
            is_read = COALESCE($1, is_read)
        WHERE id = $2
        RETURNING id, body, url, is_read, created;
      `, [is_read, notificationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "notification not found." });
    }

    res.status(200).json({ message: "notification updated successfully.", notifications:result.rows});


  } catch (error) {
    console.error("Error editing notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


// localhost:3000/notifications/0
// delte a notifications
router.delete('/:id', authenticate, async (req, res, next) => {

  const notificationId = parseInt(req.params.id);
  const userId = req.user.userId; // Get user ID from authenticated token

  try {

     if (!await isOwner(userId, notificationId)) {
      return res.status(403).json({ error: "You do not have permission to delete this notification" });
    }

    // delete the notifications with provided values
    await db.query(`DELETE FROM notifications WHERE id = $1;`, [notificationId]);

    res.status(200).json({ message: "notification deleted successfully."});
  } catch (error) {
    console.error("Error deleted contribution:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


async function isOwner(user_Id: number, notification_Id: number): Promise<boolean> {

  const result = await db.query("SELECT 1 FROM notifications WHERE user_id = $1 AND id = $2", [user_Id, notification_Id]);

  if (result.rows.length > 0) {
    return true;
  }
  return false;
}



//module.exports = router;
export default router;