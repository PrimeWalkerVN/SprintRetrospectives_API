const Board = require('../models/Board');
const List = require('../models/List');
const AppError = require('../utils/appError');
const Factory = require('../controllers/factoryController');

exports.getAllsBoards = Factory.getAll(Board);
exports.createBoard = Factory.createOne(Board);
exports.getBoardById = Factory.getOne(Board);
exports.updateBoard = Factory.updateOne(Board);
exports.deleteBoard = Factory.deleteOne(Board);

// custom
exports.createListsOnBoard = async (req, res, next) => {
  try {
    let board = await Board.findById(req.params.id);
    if (!board) {
      return next(new AppError('No document found with that ID', 404));
    }
    const list = await List.create({
      name: req.body.name,
      boardId: board._id,
    });

    await Board.updateOne(
      { _id: req.params.id },
      { $push: { lists: list._id } }
    );
    res.status(201).json({
      status: 'success',
      message: 'create a list on board success',
      data: list,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};
