const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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

userSchema.pre("save", async function (next) {
  if (!this.isModefied("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  this.password_changed_at = Date.now() - 1000;
  next();
});

userSchema.methods.correct_password = async function (candidate, password) {
  return await bcrypt.compare(candidate, password);
};

userSchema.methods.create_reset_token = async function () {
  const reset_token = crypto.randomBytes(32).toString("hex");
  this.password_reset_toekn = crypto
    .createHash("sha256")
    .update(reset_token)
    .digest("hex");
};

userSchema.methods.change_password_after = function (JWTTimestamp) {
  if (this.password_changed_at) {
    const changed_timestamp = parseInt(
      this.password_changed_at.getTime() / 1000,
      10
    );
    return JWTTimestamp < changed_timestamp;
  }
  return false;
};

module.exports = mongoose.model("users", userSchema);
