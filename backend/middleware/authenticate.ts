const jwt = require("jsonwebtoken");
const db = require('../utils/db');
require("dotenv").config(); // Load environment variables

/**
 * a helper function to handle authentication,
 * simply include in endpoint to determine if user is authenticated.
 * automatically sends back 401 access denied errors
 * use const user_id = req.user.userid; to get the id of the user
 */

const authenticate = async (req, res, next) => {
    const cookieToken = req.cookies?.session;

    const authHeader  = req.header("Authorization");
    // Remove "Bearer " prefix if present
    const bearerToken =
      authHeader?.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null;

    const token = cookieToken || bearerToken;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Find the user associated with the token
        const session = await db.query("SELECT user_id FROM sessions WHERE token = $1;", [token]);

        if (session.rows.length === 0) {
            return res.status(403).json({ message: "invalid token" });
        }
                
        req.user = decoded; // Attach user info to the request
        req.token = token;
        next(); // Continue to the next middleware or route handler
    } catch (error : any) {
        // handle specific errors, if they are JWT related handle here: 
        if(error.name === "TokenExpiredError" || error.name === "JsonWebTokenError" || error.name === "NotBeforeError"){
            if(token){
                try {
                    // delete the invalid session, so when users come back it will be removed over time
                    await db.query("DELETE FROM sessions WHERE token = $1;", [token]);
                } catch (dbError : any) {
                    console.error("Failed to delete invalid session:", dbError.message);
                }
            }
            return res.status(403).json({ message: "expired token" });
        }
        // only gets here if it's a real error
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default authenticate;
