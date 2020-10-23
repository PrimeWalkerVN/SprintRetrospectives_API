const Card = require('../models/Card');
const AppError = require('../utils/appError');
const Factory = require('../controllers/factoryController');

exports.getAllsCards = Factory.getAll(Card);
exports.createCard = Factory.createOne(Card);
exports.getCardById = Factory.getOne(Card);
exports.updateCard = Factory.updateOne(Card);
exports.deleteCard = Factory.deleteOne(Card);

// custom
exports.getCardsByListId = async (req, res, next) => {
  try {
    const doc = Card.find({ listId: req.params.id });
    if (!doc) return next(new AppError('No document found with that ID ', 404));

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
