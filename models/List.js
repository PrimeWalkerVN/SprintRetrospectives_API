const mongoose = require('mongoose');
const Board = require('./Board');

const ListSchema = new mongoose.Schema({
  boardId: { type: mongoose.Types.ObjectId, ref: 'Board', required: true },
  name: { type: String, required: true },
  cards: [{ type: mongoose.Types.ObjectId, ref: 'Card' }],
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date },
});

ListSchema.pre('save', async function (next) {
  await Board.updateOne({ _id: this.boardId }, { $push: { lists: this._id } });
  next();
});
ListSchema.pre('findByIdAndDelete', async function (next) {
  await Board.updateMany({ lists: this._id }, { $pull: { lists: this._id } });
  next();
});

const List = new mongoose.model('List', ListSchema, 'lists');
module.exports = List;
