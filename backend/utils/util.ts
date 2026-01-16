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

// returns a string at most the length of max, otherwise the string is unchanged
export function maxString(str: String, max: number): String | void {

    if(!str || str.length == 0) return;

    return str.slice(0,Math.min(str.length,max));
}


// returns true if string is in email form
export function isEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}
