const express = require("express");
const asyncWrap = require("../errors/asyncWrap");
const PersonalDiscountCodeControllers = require("../controllers/personalDiscountCode.controller");
const auth = require("../middlewares/auth");
const multer = require("multer");
const router = express.Router();

const { storagePersonalDiscountCodeImage } = require("../utils/uploadImages");
const uploadPersonalDiscountCodeImage = multer({ storage: storagePersonalDiscountCodeImage });

router.post("/create",
    auth,
    uploadPersonalDiscountCodeImage.array("images", 3),
    asyncWrap(PersonalDiscountCodeControllers.createPersonalDiscountCode)
);

router.get("/get-all", auth, asyncWrap(PersonalDiscountCodeControllers.getPersonalDiscountCodes));

router.delete("/delete", auth, asyncWrap(PersonalDiscountCodeControllers.deletePersonalDiscountCode));

router.patch("/update",
    auth,
    uploadPersonalDiscountCodeImage.array("images", 3),
    asyncWrap(PersonalDiscountCodeControllers.updatePersonalDiscountCode)
);

module.exports = router;
