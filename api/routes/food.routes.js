const express = require("express");
const router = express.Router();

const combo_router = require("./combo.routes");

const { protect, restrict_to } = require("../middlewares/auth.middleware");
const {
  add_food,
  edit_food,
  remove_food,
  get_food_item,
  get_food_items
} = require("../middlewares/foodItem.middleware");

router.use("/combo", combo_router);

router
  .route("/item")
  .get(get_food_items)
  .post(protect, restrict_to("manager"), add_food);

router
  .route("/item/:id")
  .get(get_food_item)
  .patch(protect, restrict_to("manager"), edit_food)
  .delete(protect, restrict_to("manager"), remove_food);

module.exports = router;
