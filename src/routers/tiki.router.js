const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const TikiControllers = require("../controllers/tiki.controllers");
const router = express.Router();

router.get("/get-discount-codes-by-category-from-ecommerce", asyncWrap(TikiControllers.getDiscountCodesByCategoryFromEcommerce));

router.get("/get-today-sale-product-schedules-from-ecommerce", asyncWrap(TikiControllers.getTodaySaleProductSchedulesFromEcommerce));

router.get("/get-products-by-category-from-ecommerce", asyncWrap(TikiControllers.getProductsByCategoryFromEcommerce));

module.exports = router;
