const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const ProductControllers = require("../controllers/product.controllers");
const router = express.Router();

router.get("/get-product-detail", asyncWrap(ProductControllers.getDetailProduct));

module.exports = router;
