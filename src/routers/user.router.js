const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const UserControllers = require("../controllers/user.controllers");
const multer = require("multer");
const auth = require("../middlewares/auth");
const router = express.Router();

const { storageAvatarImage } = require("../utils/uploadImages");
const uploadAvatarImage = multer({ storage: storageAvatarImage });

router.post("/register-admin-account", asyncWrap(UserControllers.registerAdminAccount));

router.post("/register-user-account", asyncWrap(UserControllers.registerUserAccount));

router.post("/login", asyncWrap(UserControllers.login));

router.get("/get-user-info", auth, asyncWrap(UserControllers.getUserInfo));

router.post("/update-user", auth, asyncWrap(UserControllers.updateUser));

router.get("/logout", auth, asyncWrap(UserControllers.logout));

router.get("/get-all-user", auth, asyncWrap(UserControllers.getAllUser));

router.delete("/delete-user", auth, asyncWrap(UserControllers.deleteUser));

module.exports = router;