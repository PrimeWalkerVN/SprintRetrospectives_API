const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  boardId: { type: mongoose.Types.ObjectId, ref: 'Board' },
  name: { type: String, required: true },
  cards: [{ type: mongoose.Types.ObjectId, ref: 'Card' }],
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date },
});
const List = new mongoose.model('List', ListSchema, 'lists');
module.exports = List;

//add tag and tag id in List at the same time
