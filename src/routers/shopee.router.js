const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const ShopeeControllers = require("../controllers/shopee.controllers");
const router = express.Router();

router.get("/get-discount-codes-by-category-from-ecommerce", asyncWrap(ShopeeControllers.getDiscountCodesByCategoryFromEcommerce));

router.get("/get-flash-sale-product-schedules-from-ecommerce", asyncWrap(ShopeeControllers.getFlashSaleProductSchedulesFromEcommerce));

router.get("/get-all-flash-sale-product-brief-from-ecommerce", asyncWrap(ShopeeControllers.getAllFlashSaleProductBriefFromEcommerce));

router.get("/get-all-flash-sale-product-by-category-from-ecommerce", asyncWrap(ShopeeControllers.getAllFlashSaleProductByCategoryFromEcommerce));

module.exports = router;