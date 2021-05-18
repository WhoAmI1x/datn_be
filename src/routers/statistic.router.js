const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const StatisticControllers = require("../controllers/statistic.controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, asyncWrap(StatisticControllers.getStatistic));

module.exports = router;