const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const TikiControllers = require("../controllers/tiki.controllers");
const router = express.Router();

router.get("/get-discount-codes-by-category-from-ecommerce", asyncWrap(TikiControllers.getDiscountCodesByCategoryFromEcommerce));

module.exports = router;
