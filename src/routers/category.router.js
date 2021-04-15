const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const CategoryControllers = require("../controllers/category.controllers");
const multer = require("multer");
const router = express.Router();

const { storageCategoryImage } = require("../utils/uploadImages");
const uploadCategoryImage = multer({ storage: storageCategoryImage });

router.post("/create-discount-code-category", uploadCategoryImage.single("image"), asyncWrap(CategoryControllers.createDiscountCodeCategory));

router.get("/get-discount-code-categories", asyncWrap(CategoryControllers.getDiscountCodeCategories));

router.get("/get-discount-codes-by-category", asyncWrap(CategoryControllers.getDiscountCodesByCategory));

module.exports = router;
