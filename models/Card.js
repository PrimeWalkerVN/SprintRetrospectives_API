const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  content: { type: String, required: true },
  date: Date,
  listId: { type: mongoose.Types.ObjectId, ref: 'List' },
});

const Card = new mongoose.model('Card', CardSchema, 'cards');
module.exports = Card;
