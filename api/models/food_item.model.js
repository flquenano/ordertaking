const mongoose = require("mongoose");
const id = mongoose.Types.ObjectId;

const foodItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  type: {
    type: String,
    enum: ["breakfast", "lunch", "value", "drinks", "dessert", "side"]
  },
  availability: { type: Boolean, default: true }
});

module.exports = mongoose.model("fooditems", foodItemSchema);
