const List = require('./List');
const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  content: { type: String, required: true },
  listId: { type: mongoose.Types.ObjectId, ref: 'List' },
  createdAt: { type: Date, default: Date.now },
});

CardSchema.pre('save', async function (next) {
  console.log(List);
  await List.updateOne({ _id: this.listId }, { $push: { cards: this._id } });
  next();
});
CardSchema.pre('findByIdAndDelete', async function (next) {
  await List.updateMany({ cards: this._id }, { $pull: { cards: this._id } });
  next();
});

const Card = mongoose.model('Card', CardSchema, 'cards');
module.exports = Card;
