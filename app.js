const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");

const AppError = require("./api/utils/appError.util");
const globalErrorHandler = require("./api/middlewares/error.middleware");

//Routes
const user_routes = require("./api/routes/user.routes");

const app = express();

// 1.) Global Middlewares
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("tiny"));
}

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(xss());

// 2.) Routes

app.use(`${process.env.APP_VER}/user`, user_routes);

app.all("*", (req, res, next) => {
  next(new AppError(`${req.originalUrl} not found!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
