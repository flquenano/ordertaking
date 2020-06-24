const User = require("../models/users.model");
const jwt_util = require("./jwt.middleware.js");
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");

exports.protect = catchAsync(async (req, res, next) => {
  const token = get_token(req);
  if (!token) {
    return next(new AppError("User not logged in!", 401));
  }
  const decoded = jwt_util.decode_token(token);
  const current_user = User.findById(decoded.id);
  if (!current_user) {
    return next(new AppError("User doesn't exists!", 401));
  }
  req.user = current_user;
  next();
});

exports.register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const new_user = await User.create({
    name: name,
    email: email,
    password: password
  });
  req.user = new_user;
  req.user.status_code = 201;
  return jwt_util.send_token;
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password!", 400));
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correct_password(password, user.password))) {
    return next(new AppError("Incorrect Email or Password!", 401));
  }
  req.user = user;
  req.user.status_code = 200;
  return jwt_util.send_token;
});
