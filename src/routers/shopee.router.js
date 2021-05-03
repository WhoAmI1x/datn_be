const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const ShopeeControllers = require("../controllers/shopee.controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/get-discount-codes-by-category-from-ecommerce", auth, asyncWrap(ShopeeControllers.getDiscountCodesByCategoryFromEcommerce));

router.get("/get-flash-sale-product-schedules-from-ecommerce", auth, asyncWrap(ShopeeControllers.getFlashSaleProductSchedulesFromEcommerce));

router.get("/get-products-by-category-from-ecommerce", auth, asyncWrap(ShopeeControllers.getProductsByCategoryFromEcommerce));

module.exports = router;