const ErrorBody = require("../utils/appError.util");

const cast_error_db = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new ErrorBody(message, 404);
};

const duplicate_field_db = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `"${value}" already exist! Please use another value!`;
  return new ErrorBody(message, 400);
};

const validation_error_db = (error) => {
  const errors = Object.values(error.errors).map((err) => err.message);
  const message = `Invalid input date. ${errors.join(". ")}`;
  return new ErrorBody(message, 400);
};

const jwt_error = () => new ErrorBody("Invalid Token", 401);
const jwt_expired = () => new ErrorBody("Session Expired!", 401);

const send_error_development = (err, res) => {
  const { statusCode, status, errmsg, stack } = err;
  res.status(statusCode).json({
    status,
    message: errmsg,
    stack
  });
};

const send_error_production = (err, res) => {
  const { statusCode, status, errmsg, stack, isOperational } = err;
  if (isOperational) {
    return res.status(statusCode).json({
      status,
      message: message
    });
  }
  console.log("Error: ", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!`"
  });
};

module.exports = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    return send_error_development(err, req, res);
  }
  let error = { ...err };
  if (err.code === 11000) error = duplicate_field_db(error);
  if (err.name === "CastError") error = cast_error_db(error);
  if (err.name === "ValidationError") error = validation_error_db(error);
  if (err.name === "JsonWebTokenError") error = jwt_error(error);
  if (err.name === "TokenExpiredError") error = jwt_expired(error);
  send_error_production(error, res);
};
