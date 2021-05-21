const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const DiscountCodeControllers = require("../controllers/discountCode.controllers");
const auth = require("../middlewares/auth");
const multer = require("multer");
const router = express.Router();

router.get("/get-discount-codes-by-category", auth, asyncWrap(DiscountCodeControllers.getDiscountCodesByCategory));

router.delete("/delete-discount-code-by-id", auth, asyncWrap(DiscountCodeControllers.deleteDiscountCodeById));

router.post("/save-discount-code", auth, asyncWrap(DiscountCodeControllers.saveDiscountCode));

module.exports = router;