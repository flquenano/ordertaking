const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync.util");
const { get } = require("http");

const generate_token = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });

exports.send_token = (req, res) => {
  const { _id, status_code, ...user } = req.user;
  const token = generate_token(_id);
  delete user.password;
  delete user.status_code;
  res.status(status_code).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

exports.get_token = (req) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
};

exports.decode_token = async (token) =>
  await promisify(jwt.verify)(token, process.env.JWT_SECRET);
