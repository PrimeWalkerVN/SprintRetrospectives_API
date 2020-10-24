const AppError = require('./appError');
module.exports = (catchAsync) => async (request, response, next) => {
  try {
    await catchAsync(request, response, next);
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      if (error.keyValue.email != null)
        return next(new AppError('email already exists', 400));
      else if (error.keyValue.username != null)
        return next(new AppError('username already exist', 400));
      return next(new AppError(error, 400));
    } else {
      return next(new AppError(error.message, 400));
    }
  }
};
