const User = require('../models/User');
const { signUpValidation, loginValidation } = require('../utils/validation');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./factoryController');
const passport = require('passport');
exports.getAll = Factory.getAll(User);

exports.login = catchAsync(async (req, res, next) => {
  const { error } = await loginValidation(req.body);
  if (error) return next(new AppError(error, 400));
  const user = await User.findOne({ username: req.body.username });
  if (!user) return next(new AppError("user doesn't exists", 400));

  //passport
  return passport.authenticate(
    'local-login',
    { session: false },
    (error, passportUser, info) => {
      if (error) {
        return next(new AppError(error, 400));
      }
      if (passportUser) {
        return res.status(201).json({
          status: 'success',
          data: {
            user: passportUser,
            token: passportUser.generateJWT(passportUser.username),
          },
        });
      }
      return next(new AppError(info, 400));
    }
  )(req, res, next);
});

exports.signUp = catchAsync(async (req, res, next) => {
  const { error } = await signUpValidation(req.body);
  if (error) return next(new AppError(error, 400));

  //passport
  return passport.authenticate(
    'local-signup',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(new AppError(err, 400));
      }
      if (passportUser) {
        res.status(201).json({
          status: 'success',
          data: {
            user: passportUser,
            token: passportUser.generateJWT(passportUser.username),
          },
        });
      }
      return next(new AppError(info, 400));
    }
  )(req, res, next);
});

exports.SignWithGoogle = async (req, res, next) => {
  let token = req.user.token;
  res.status(200).json({
    status: 'success',
    data: {
      token: token,
    },
  });
};

exports.SignWithFacebook = async (req, res, next) => {
  const token = req.user.token;
  res.status(200).json({
    status: 'success',
    data: {
      token: token,
    },
  });
};

exports.getUserFromToken = async (req, res, next) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return res.status(401).json({ errors: err });
      }
      if (passportUser) {
        return res.status(200).json({ user: passportUser });
      }
      return res.status(400).json({
        info: 'Please check if your token is valid and provide a good one',
      });
    }
  )(req, res, next);
};
