const mongoose = require('mongoose');
const List = require('./List');

const CardSchema = new mongoose.Schema({
  content: { type: String, required: true },
  listId: { type: mongoose.Types.ObjectId, ref: 'List' },
  createdAt: { type: Date, default: Date.now },
});
//add card and card id in List at the same time
CardSchema.pre('save', async function (next) {
  await List.updateOne({ _id: this.listId }, { $push: { cards: this._id } });
  next();
});
CardSchema.pre('findByIdAndDelete', async function (next) {
  await List.updateMany(
    { cards: req.params.id },
    { $pull: { cards: req.params.id } }
  );
  next();
});

const Card = new mongoose.model('Card', CardSchema, 'cards');
module.exports = Card;
