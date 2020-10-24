const Board = require('../models/Board');
const List = require('../models/List');
const AppError = require('../utils/appError');
const Factory = require('../controllers/factoryController');
const catchAsync = require('../utils/catchAsync');

exports.getAllsBoards = Factory.getAll(Board);
exports.createBoard = Factory.createOne(Board);
exports.getBoardById = Factory.getOne(Board);
exports.updateBoard = Factory.updateOne(Board);
exports.deleteBoard = Factory.deleteOne(Board);

// custom
exports.createListsOnBoard = catchAsync(async (req, res, next) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    return next(new AppError('No document found with that ID', 404));
  }
  const list = await List.create({
    name: req.body.name,
    boardId: board._id,
  });

  await Board.updateOne({ _id: req.params.id }, { $push: { lists: list._id } });
  res.status(201).json({
    status: 'success',
    message: 'create a list on board success',
    data: list,
  });
});

exports.deleteListsOnBoard = catchAsync(async (req, res, next) => {
  await Board.updateMany(
    { lists: req.params.id },
    { $pull: { lists: req.params.id } }
  );
  next();
});
