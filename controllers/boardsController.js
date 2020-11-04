const Board = require('../models/Board');
const List = require('../models/List');
const AppError = require('../utils/appError');
const Factory = require('../controllers/factoryController');
const catchAsync = require('../utils/catchAsync');
const { appSuccess } = require('../utils/appSuccess');

exports.getAllsBoards = Factory.getAll(Board);
exports.createBoard = Factory.createOne(Board);
exports.getBoardById = Factory.getOne(Board);
exports.updateBoard = Factory.updateOne(Board);

// custom
exports.getBoardsByUserId = catchAsync(async (req, res, next) => {
  const doc = await Board.find({ userId: req.user._id });

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: doc,
  });
});
exports.createListsOnBoard = catchAsync(async (req, res, next) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    return next(new AppError('No document found with that ID', 404));
  }
  const list = await List.create({
    name: req.body.name,
    boardId: board._id,
  });

  res.status(201).json(appSuccess(list, 'Create list on board success'));
});
exports.deleteBoard = catchAsync(async (req, res, next) => {
  const doc = await Board.findByIdAndDelete(req.params.id);
  await List.deleteMany({ boardId: req.params.id });
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
