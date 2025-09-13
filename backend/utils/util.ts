import { Response } from "express";
import db from "./db";

export async function getUserId(username: String, res: Response): Promise<number | void> {

    try {
        const userIDCheck = await db.query(
            `SELECT id 
            FROM users 
            WHERE username = $1`, [username]);

        if (userIDCheck.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        return userIDCheck.rows[0].id;
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: 'Error retrieving user data' });
        return;
    }
}
