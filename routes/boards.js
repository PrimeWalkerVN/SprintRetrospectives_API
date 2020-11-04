const express = require('express');
const router = express.Router();
const boardsController = require('../controllers/boardsController');
const listsController = require('../controllers/listsController');

// Get all boards
router.get('/all', boardsController.getAllsBoards);

// Get boards by userId
router.get('/', boardsController.getBoardsByUserId);

// Get one board
router.get('/:id', boardsController.getBoardById);

// Get lists on board
router.get('/:id/lists', listsController.getListsByBoardId);

// Create one board
router.post('/', boardsController.createBoard);

// create lists on board
router.post('/:id/lists', boardsController.createListsOnBoard);

// Update one board
router.put('/:id', boardsController.updateBoard);

// Delete one board
router.delete('/:id', boardsController.deleteBoard);

module.exports = router;
