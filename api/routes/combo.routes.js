const express = require("express");
const router = express.Router();

const { protect, restrict_to } = require("../middlewares/auth.middleware");
const {
  add_combo,
  edit_combo,
  delete_combo,
  get_combos,
  get_combo
} = require("../middlewares/combo.middleware");

router
  .route("/")
  .get(get_combos)
  .post(protect, restrict_to("manager"), add_combo);

router
  .route("/:id")
  .get(get_combo)
  .patch(protect, restrict_to("manager"), edit_combo)
  .delete(protect, restrict_to("manager"), delete_combo);

module.exports = router;
