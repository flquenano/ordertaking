const mongoose = require("mongoose");
const id = mongoose.Types.ObjectId;

const orderSchema = mongoose.Schema({
  order_number: { type: Number },
  table_number: { type: Number, default: 0 },
  cashier_id: { type: id, ref: "users", required: true },
  orders: {
    items: [{ type: id, ref: "fooditems" }],
    combos: [{ type: id, ref: "combos" }]
  },
  date_added: {
    type: Date,
    default: Date.now()
  },
  timelaps: {
    start: { type: Date, default: Date.now() },
    ready: { type: Date, required: true }
  },
  status: { type: String, enum: ["pending", "ready", "done", "cancelled"] }
});

module.exports = mongoose.model("orders", orderSchema);
