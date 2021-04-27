const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const ProductControllers = require("../controllers/product.controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/get-product-detail", auth, asyncWrap(ProductControllers.getDetailProduct));

module.exports = router;
