const List = require('./List');
const mongoose = require('mongoose');
const CardSchema = new mongoose.Schema({
  content: { type: String, required: true },
  listId: { type: mongoose.Types.ObjectId, ref: 'List' },
  createdAt: { type: Date, default: Date.now },
  order: { type: Number, default: 0 },
});

CardSchema.pre('save', async function (next) {
  await List.updateOne({ _id: this.listId }, { $push: { cards: this._id } });
  if (this.isNew) {
    const doc = await (await Card.find({ listId: this.listId })).pop();
    if (doc) this.order = doc.order + 1;
  }
  next();
});
CardSchema.pre('findByIdAndDelete', async function (next) {
  await List.updateMany({ cards: this._id }, { $pull: { cards: this._id } });
  next();
});

const Card = mongoose.model('Card', CardSchema, 'cards');
module.exports = Card;
