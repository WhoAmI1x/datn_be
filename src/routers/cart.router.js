const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const CartControllers = require("../controllers/cart.controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, asyncWrap(CartControllers.getCarts));

module.exports = router;
