const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const ScheduleControllers = require("../controllers/schedule.controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/get-schedules", auth, asyncWrap(ScheduleControllers.getSchedules));

module.exports = router;
