const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const compressImage = async (filePath) => {
    // e.g., image.jpg → image-compressed.jpg
    const outputFilePath = filePath.replace(/(\.\w+)$/, '-compressed$1');

    try {
        await sharp(filePath)
            .resize(512, 512, { fit: 'cover', position: 'centre' })
            .jpeg({ quality: 90 })
            .toFile(outputFilePath);

        // Remove the original file and rename the compressed one
        fs.unlinkSync(filePath);
        fs.renameSync(outputFilePath, filePath);

        console.log("Image compressed successfully!");
    } catch (err) {
        console.error("Error compressing image:", err);
    }
};

module.exports = compressImage;