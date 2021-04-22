const multer = require("multer");

const storageCategoryImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/assets/images/categories");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const storageAvatarImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/assets/images/avatars");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

module.exports = { storageCategoryImage, storageAvatarImage };