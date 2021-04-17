const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const CategoryControllers = require("../controllers/category.controllers");
const multer = require("multer");
const router = express.Router();

const { storageCategoryImage } = require("../utils/uploadImages");
const uploadCategoryImage = multer({ storage: storageCategoryImage });

router.post("/create-category", uploadCategoryImage.single("image"), asyncWrap(CategoryControllers.createCategory));

router.get("/get-categories", asyncWrap(CategoryControllers.getCategories));

router.get("/get-discount-codes-by-category", asyncWrap(CategoryControllers.getDiscountCodesByCategory));

module.exports = router;
