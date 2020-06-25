const express = require("express");
const { login, register, protect } = require("../middlewares/auth.middleware");
const upload = require("../utils/multer.util");

const router = express.Router();

router.post("/login", login);
router.post("/register", upload.single("profile_image"), register);

module.exports = router;
