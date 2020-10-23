const express = require('express');
const router = express.Router();

// login
router.get('/login', (req, res) => {
  return res.status(200).json('Login success');
});

// register
router.get('/register', (req, res) => {
  return res.status(200).json('register success');
});

// update password
router.put('/changePassword', (req, res) => {
  return res.status(201).json('update success');
});

// Create user
router.post('/create', (req, res) => {
  return res.status(203).json('create success');
});

// delete user
router.delete('/delete/:id', (req, res) => {
  return res.status(202).json('delete success');
});

module.exports = router;
