const mongoose = require('mongoose');

module.exports = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, 'Please provide your name'],
        unique: [true, 'Username already exists, try another!'],
        trim: true,
        minlength: [6, 'At least 6 character'],
      },
      email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: [true, 'Email already exists, try another'],
      },
      password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 6,
      },
      token: { type: String },
      fullName: { type: String },
      avatar: { type: String },
      createdAt: { type: Date, default: Date.now },
      active: { type: Boolean, default: true },
    },
    { timestamps: true }
  ),
  'users'
);
