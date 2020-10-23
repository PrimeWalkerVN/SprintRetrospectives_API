const AppError = require('./../utils/appError');

// delete one
exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

// update one
exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

// create one
exports.createOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

// get one
exports.getOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

// get all
exports.getAll = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.find();

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
