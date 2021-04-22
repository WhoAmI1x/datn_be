const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const UserControllers = require("../controllers/user.controllers");
const multer = require("multer");
const auth = require("../middlewares/auth");
const router = express.Router();

const { storageAvatarImage } = require("../utils/uploadImages");
const uploadAvatarImage = multer({ storage: storageAvatarImage });

router.post("/register-admin-account", uploadAvatarImage.single("avatar"), asyncWrap(UserControllers.registerAdminAccount));

router.post("/login-with-admin-role", auth, asyncWrap(UserControllers.loginWithAdminRole));

router.post("/login-with-user-role", auth, asyncWrap(UserControllers.loginWithUserRole));

module.exports = router;