const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const CategoryControllers = require("../controllers/category.controllers");
const auth = require("../middlewares/auth");
const multer = require("multer");
const router = express.Router();

const { storageCategoryImage } = require("../utils/uploadImages");
const uploadCategoryImage = multer({ storage: storageCategoryImage });

router.post("/create-category", auth, uploadCategoryImage.single("image"), asyncWrap(CategoryControllers.createCategory));

router.get("/get-categories", auth, asyncWrap(CategoryControllers.getCategories));

router.delete("/delete-category", auth, asyncWrap(CategoryControllers.deleteCategory));

router.patch("/update-category", auth, uploadCategoryImage.single("image"), asyncWrap(CategoryControllers.updateCategory));

router.get("/get-discount-codes-by-category", auth, asyncWrap(CategoryControllers.getDiscountCodesByCategory));

module.exports = router;
