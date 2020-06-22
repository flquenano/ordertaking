const mongoose = require("mongoose");
const id = mongoose.Types.ObjectId;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  privilege: {
    type: String,
    default: "cashier",
    enum: ["cashier", "manager", "admin"]
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Minimum password length is 8 chararacters"],
    maxLength: [25, "Maximum password length is 25"],
    select: false
  },
  password_changed_at: {
    type: Date,
    select: false
  },
  password_reset_token: String,
  password_reset_expires: Date,
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("users", userSchema);
