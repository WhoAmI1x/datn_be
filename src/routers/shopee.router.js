const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const ShopeeControllers = require("../controllers/shopee.controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/get-discount-codes-by-category-from-ecommerce", auth, asyncWrap(ShopeeControllers.getDiscountCodesByCategoryFromEcommerce));

router.get("/get-flash-sale-product-schedules-from-ecommerce", auth, asyncWrap(ShopeeControllers.getFlashSaleProductSchedulesFromEcommerce));

router.get("/get-all-flash-sale-product-brief-from-ecommerce", auth, asyncWrap(ShopeeControllers.getAllFlashSaleProductBriefFromEcommerce));

router.get("/get-all-flash-sale-product-by-category-from-ecommerce", auth, asyncWrap(ShopeeControllers.getAllFlashSaleProductByCategoryFromEcommerce));

module.exports = router;