const mongoose = require("mongoose");
const id = mongoose.Types.ObjectId;

const comboSchema = mongoose.Schema({
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  items: [{ type: id, ref: "fooditems" }],
  availability: { type: Boolean, default: true }
});

module.exports = mongoose.model("foodcombos", comboSchema);
