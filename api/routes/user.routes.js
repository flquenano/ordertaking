const express = require("express");
const {
  login,
  register,
  protect,
  restrict_to
} = require("../middlewares/auth.middleware");
const upload = require("../utils/multer.util");

const router = express.Router();

router.post("/login", login);
router.post("/register", upload.single("profile_image"), register);
router.post(
  "/add-employee",
  protect,
  restrict_to("admin", "manager"),
  upload.single("profile_image"),
  register
);
// router.post("/sample", protect);

module.exports = router;
