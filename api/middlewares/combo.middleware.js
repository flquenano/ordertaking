const Combo = require("../models/combo.model");
const catchAsync = require("../utils/catchAsync.util");
const AppError = require("../utils/appError.util");

exports.get_combo = catchAsync(async (req, res, next) => {});

exports.get_combos = catchAsync(async (req, res) => {
  const docs = await Combo.find({});
  res.status(200).json({
    status: "success",
    data: {
      docs
    }
  });
});

exports.add_combo = catchAsync(async (req, res, next) => {
  const new_doc = await Combo.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      doc: new_doc
    }
  });
});

exports.edit_combo = catchAsync(async (req, res, next) => {
  const doc = await Combo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return next(new AppError("Record doesn't exists!", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      doc
    }
  });
});

exports.delete_combo = catchAsync(async (req, res, next) => {
  const doc = await Combo.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError("Record doesn't Exists", 404));
  }
  res.status(204).json({
    status: "success",
    data: null
  });
});
