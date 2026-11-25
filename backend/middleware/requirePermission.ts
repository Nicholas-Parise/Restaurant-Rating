import { getUserPermissions } from "../utils/util";
require("dotenv").config(); // Load environment variables

/**
 * a helper function to handle Authorization,
 * can take several Parameters: 'user', 'moderator', 'admin'
 * With default being for a 'user'
 * When a user is 'banned' they will always return 403
 */

const requirePermission = (requiredPermissions: string|null= 'user') => {
    return async (req, res, next) => {
    
        const userId = req.user.userId;
        const perms = requiredPermissions ?? "default";
        try {
            
            const permission = await getUserPermissions(userId);

            console.log("permission",permission);

            if (!permission) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Continue to the next middleware or route handler if....
            if(permission === 'admin'){
                next();
            }else if(permission === 'moderator' && (perms === 'moderator' || perms === 'user')){
                next();
            }else if(permission === 'user' && perms === 'user'){
                next();
            }else{
                return res.status(403).json({ message: "Please wait for your ban to finish before performing this action again." });
            }

            //return res.status(403).json({ message: "User lacks permissions" });
        
        } catch (error : any) {
            console.error("Permission check failed: ", error);
            return res.status(404).json({ message: "Can't find user" });
        }
    };
};

export default requirePermission;

