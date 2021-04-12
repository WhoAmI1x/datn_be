const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const UserControllers = require("../controllers/user.controllers");
const router = express.Router();

router.get("/", asyncWrap(UserControllers.getUserInfo))

module.exports = router;