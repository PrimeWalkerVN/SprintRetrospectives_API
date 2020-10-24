const mongoose = require('mongoose');
module.exports = mongoose.model(
  'Board',
  new mongoose.Schema({
    name: { type: String, required: true },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    lists: [{ type: mongoose.Types.ObjectId, ref: 'List' }],
    createdAt: { type: Date, default: Date.now },
  }),
  'boards'
);
