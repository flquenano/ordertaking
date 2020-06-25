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

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, privilege } = req.body;
  let user = {
    name,
    email,
    password,
    privilege
  };
  if (req.file === undefined) {
    user = {
      ...user,
      profile: "link"
    };
  } else {
    user = {
      ...user,
      profile: req.file.location
    };
  }
  const new_user = await User.create(user);
  if (!new_user) return next(new AppError("Registration Failed!", 500));
  req.user = new_user._doc;
  req.user.status_code = 201;
  return jwt_util.send_token(req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password!", 400));
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correct_password(password, user.password))) {
    return next(new AppError("Incorrect Email or Password!", 401));
  }
  req.user = user._doc;
  req.user.status_code = 200;
  return jwt_util.send_token(req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  const token = jwt_util.get_token(req);
  console.log(token);
  if (!token)
    return next(new AppError("User verification failed! Please Login!", 401));

  const decoded = await jwt_util.decode_token(token);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("User doesn't exists!", 401));
  }

  if (user.change_password_after(decoded.iat)) {
    return next(new AppError("User recently changed password!", 401));
  }

  req.user = user;
  next();
});

exports.restrict_to = (...privileges) => (req, res, next) => {
  if (!privileges.includes(req.user.privilege)) {
    return next(new AppError("Not Authorized!", 403));
  }
  next();
};
