const User = require('../models/User');
const { signUpValidation, loginValidation } = require('../utils/validation');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./factoryController');

exports.getAll = Factory.getAll(User);

exports.login = catchAsync(async (req, res, next) => {
  const { error } = await loginValidation(req.body);
  if (error) return next(new AppError(error, 400));
  const user = await User.findOne(req.body);
  if (!user) return next(new AppError("user doesn't exists", 400));
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.signUp = catchAsync(async (req, res, next) => {
  const { error } = await signUpValidation(req.body);
  if (error) return next(new AppError(error, 400));
  const doc = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: doc,
  });
});
