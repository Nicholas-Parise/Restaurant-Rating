import { Response } from "express";
import db from "./db";
import * as path from "path";
import fs from "fs";

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

// Delete the old picture off of server
export async function deleteImage(picture: string) {

  const projectRoot = path.join(process.cwd());
  const filePath = picture;

  // if the file is not null and is different that default
  if (!filePath || filePath === "/assets/placeholder-avatar.png") return;

  if (!filePath.startsWith('/uploads/')) return;

  const oldPicPath = path.join(projectRoot, filePath);

  try {
    if (fs.existsSync(oldPicPath)) {
      await fs.promises.unlink(oldPicPath);
      console.log("Deleted: " + oldPicPath);
    } else {
      console.log("File does not exist:", oldPicPath);
    }
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("Error deleting file:", error);
    }
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
