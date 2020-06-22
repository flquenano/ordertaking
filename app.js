const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");

const AppError = require("./api/utils/appError.util");
const globalErrorHandler = require("./api/middlewares/error.middleware");

const app = express();

// 1.) Global Middlewares
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(xss());

// 2.) Routes

app.all("*", (req, res, next) => {
  next(new AppError(`${req.originalUrl} not found!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
