const FoodItem = require("../models/food_item.model");
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");

exports.get_food_item = catchAsync(async (req, res, next) => {
  const doc = await FoodItem.findOne(req.body.food_id);
  if (!doc) {
    return next(new AppError("Record doesn't exists!", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      food: doc
    }
  });
});
exports.get_food_items = catchAsync(async (req, res, next) => {
  const docs = await FoodItem.find({});
  res.status(200).json({
    status: "success",
    data: {
      food: docs
    }
  });
});

exports.add_food = catchAsync(async (req, res, next) => {
  const new_doc = await FoodItem.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      food: new_doc
    }
  });
});

exports.remove_food = catchAsync(async (req, res, next) => {
  const doc = await FoodItem.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError("Record doesn't exists!", 404));
  }
  res.status(204).json({
    status: "success",
    data: null
  });
});

exports.edit_food = catchAsync(async (req, res, next) => {
  const doc = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return next(new AppError("Record doesn't exists!", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      food: doc
    }
  });
});
