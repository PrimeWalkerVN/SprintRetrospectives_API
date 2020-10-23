const List = require('../models/List');
const AppError = require('../utils/appError');
const Card = require('../models/Card');
const Factory = require('./factoryController');

exports.getAllsLists = Factory.getAll(List);
exports.getListById = Factory.getOne(List);
exports.updateList = Factory.updateOne(List);
exports.deleteList = Factory.deleteOne(List);

// Custom
exports.getListsByBoardId = async (req, res, next) => {
  try {
    const doc = await List.find({ boardId: req.params.id });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

exports.createCardOnList = async (req, res, next) => {
  try {
    let list = await List.findById(req.params.id);
    if (!list) {
      return next(new AppError('No document found with that ID', 404));
    }
    const card = await Card.create({
      name: req.body.name,
      listId: list._id,
      content: req.body.content,
    });

    await List.updateOne(
      { _id: req.params.id },
      { $push: { cards: card._id } }
    );
    res.status(201).json({
      status: 'success',
      message: 'create card on list success',
      data: card,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

exports.deleteCardsOnList = async (req, res, next) => {
  try {
    await List.updateMany(
      { cards: req.params.id },
      { $pull: { cards: req.params.id } }
    );
    next();
  } catch (error) {
    return next(new AppError(error.message), 400);
  }
};
