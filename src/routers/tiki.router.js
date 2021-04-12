const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const TikiControllers = require("../controllers/tiki.controllers");
const multer = require("multer");
const router = express.Router();

const storageCategoryImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/assets/images/categories");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})

const uploadCategoryImage = multer({ storage: storageCategoryImage });

router.post("/create-discount-code-category", uploadCategoryImage.single("image"), asyncWrap(TikiControllers.createDiscountCodeCategory));

router.get("/discount-code-categories", asyncWrap(TikiControllers.getDiscountCodeCategory));

module.exports = router;
