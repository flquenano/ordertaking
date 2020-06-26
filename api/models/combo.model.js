const mongoose = require("mongoose");
const id = mongoose.Types.ObjectId;

const comboSchema = mongoose.Schema({
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  items: [
    {
      food: { type: id, ref: "fooditems" },
      quantity: { type: Number, default: 1 }
    }
  ],
  availability: { type: Boolean, default: true },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

comboSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items.food",
    select: "name"
  });
  next();
});

module.exports = mongoose.model("foodcombos", comboSchema);
