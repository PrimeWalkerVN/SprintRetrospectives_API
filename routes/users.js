const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// get all users
router.get('/', userController.getAll);

// Login
router.get('/login', userController.login);

// sign up
router.post('/signUp', userController.signUp);

module.exports = router;
