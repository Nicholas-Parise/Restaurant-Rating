const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const uploadRoot = path.join(process.cwd(), 'uploads');

function getUploadDir(req) {
    if (req.baseUrl.includes('/items')) {
        return path.join(uploadRoot, 'items');
    } else if (req.baseUrl.includes('/users')) {
        return path.join(uploadRoot, 'users');
    } else if (req.baseUrl.includes('/restaurants')) {
        return path.join(uploadRoot, 'restaurants');
    } else {
        return path.join(uploadRoot, 'misc');
    }
}

/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir;

        // Determine directory based on request path or field name
        if (req.baseUrl.includes('/items')) {
            uploadDir = path.join(uploadRoot, 'items');
        } else if (req.baseUrl.includes('/users')) {
            uploadDir = path.join(uploadRoot, 'users');
        } else if (req.baseUrl.includes('/restaurants')) {
            uploadDir = path.join(uploadRoot, 'restaurants');
        }else {
            uploadDir = path.join(uploadRoot, 'misc'); // Fallback for other uploads
        }

        ensureDirExists(uploadDir); // Create directory if it doesn't exist
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        //cb(null, file.fieldname + '-' + Date.now() + extension); // save file name as "filename-11684523.png"
        cb(null, `${req.user.userId}-${Date.now()}${extension}`); // Save file as userId-11684523.extension
    }
});
*/

const upload = multer({
    storage:  multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, and GIF files are allowed'));
        }
        cb(null, true);
    }
}).single('picture'); // this is the expected file name from the client


// Middleware function to handle file upload
const uploadPicture = (req, res, next) => {
    upload(req, res, async (err) => {

        if (err) {
            if (err instanceof multer.MulterError) {
                // Handle Multer-specific errors
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ message: 'File is too large. Max size is 5MB.' });
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({ message: 'Unexpected file field. Ensure the correct field name \'picture\' is used.' });
                }
            } else{
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Error during file upload.' });
        }

        if (!req.file) {
            return next();
        }

                try {

            const uploadDir = getUploadDir(req);
            ensureDirExists(uploadDir);

            const filename = `${req.user.userId}-${Date.now()}.jpg`;
            const filepath = path.join(uploadDir, filename);

            await sharp(req.file.buffer)
                .resize(512, 512, {
                    fit: 'cover', // crops center square
                    position: 'centre'
                })
                .jpeg({ quality: 90 })
                .toFile(filepath);

            // Save relative path for DB
            const folder = path.basename(uploadDir);
            req.filePath = `/uploads/${folder}/${filename}`;
            req.file.filename = filename;

        next(); // Proceed to the next middleware or route handler

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Image processing failed' });
        }

    });
};


module.exports = uploadPicture;