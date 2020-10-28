const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const passport = require('passport');
const auth = require('../middlewares/auth');

// get all users
router.get('/', userController.getAll);

// Login
router.post('/login', userController.login);

// sign up
router.post('/signUp', userController.signUp);

// facebook
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
  })
);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    scope: ['email'],
  }),
  userController.SignWithFacebook
);

// google
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  userController.SignWithGoogle
);

// get me
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// get user from token header
router.get('/token', userController.getUserFromToken);
module.exports = router;
