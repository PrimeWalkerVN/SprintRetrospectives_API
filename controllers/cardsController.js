const Card = require('../models/Card');
const AppError = require('../utils/appError');
const Factory = require('../controllers/factoryController');
const catchAsync = require('../utils/catchAsync');
const { appSuccess } = require('../utils/appSuccess');

exports.getAllsCards = Factory.getAll(Card);
exports.createCard = Factory.createOne(Card);
exports.getCardById = Factory.getOne(Card);
exports.updateCard = Factory.updateOne(Card);
exports.deleteCard = Factory.deleteOne(Card);

// custom
exports.getCardsByListId = catchAsync(async (req, res, next) => {
  const doc = await Card.find({ listId: req.params.id });
  if (!doc) return next(new AppError('No document found with that ID ', 404));
  res.status(200).json(appSuccess(doc));
});
