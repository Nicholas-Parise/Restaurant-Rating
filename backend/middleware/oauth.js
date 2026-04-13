const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../utils/db');

/*
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../utils/db";
*/

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const googleId = profile.id;
            const name = profile.name;
            const picture = profile.picture || "/assets/placeholder-avatar.png";

            // Check if user exists by google ID
            const auth_google = await db.query('SELECT * FROM users WHERE google_id = $1;', [googleId]);

            if (auth_google.rows.length > 0) {
                // they exist so return
                const user = auth_google.rows[0];
                return done(null, user);
            }

            let user;
            const auth_email = await db.query('SELECT * FROM users WHERE email = $1;', [email]);

            if (auth_email.rows.length > 0) {
                // link google account to user
                user = auth_email.rows[0];
                 await db.query("UPDATE users SET google_id = $1 WHERE id = $2;", [googleId, user.id]);

            } else {
                // Create new user
                const newUser = await db.query(
                    `INSERT INTO users (email, name, google_id, picture, notifications, pro) 
                VALUES ($1, $2, $3, $4, true, false) RETURNING *;`,
                    [email, name, googleId, picture]);

                user = newUser.rows[0];
            }

            done(null, user);
        } catch (err) {
            done(err);
        }
    }));