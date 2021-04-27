const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const UserControllers = require("../controllers/user.controllers");
const multer = require("multer");
const auth = require("../middlewares/auth");
const router = express.Router();

const { storageAvatarImage } = require("../utils/uploadImages");
const uploadAvatarImage = multer({ storage: storageAvatarImage });

router.post("/register-admin-account", asyncWrap(UserControllers.registerAdminAccount));

router.post("/login-with-admin-role", asyncWrap(UserControllers.loginWithAdminRole));

router.get("/get-user-info", auth, asyncWrap(UserControllers.getUserInfo));

router.get("/logout", auth, asyncWrap(UserControllers.logout));

router.get("/get-all-user", auth, asyncWrap(UserControllers.getAllUser));

router.delete("/delete-user", auth, asyncWrap(UserControllers.deleteUser));

router.post("/login-with-user-role", asyncWrap(UserControllers.loginWithUserRole));

module.exports = router;