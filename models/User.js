const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const jwt_secret = require('../config/config');

const userSchema = new mongoose.Schema({
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
  type: String,
  facebookId: String,
  googleId: String,
  token: { type: String },
  name: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

userSchema.pre('save', async function (next) {
  // Hash the password with cost of 12
  this.password = await bcrypt.hashSync(
    this.password,
    bcrypt.genSaltSync(12),
    null
  );
  next();
});
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJWT = (username) => {
  const today = new Date();
  // JWT Token expires 15 minutes after the creation
  const expirationDate = new Date(today);
  expirationDate.setMinutes(today.getMinutes() + 60);

  return jwt.sign(
    {
      username: username,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    jwt_secret.secret
  );
};

const User = new mongoose.model('User', userSchema, 'users');
module.exports = User;
