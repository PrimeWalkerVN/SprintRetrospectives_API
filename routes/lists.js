const express = require('express');
const router = express.Router();
const listsController = require('../controllers/listsController');
const cardsController = require('../controllers/cardsController');
const boardsController = require('../controllers/boardsController');

// Get all list
router.get('/', listsController.getAllsLists);

// Get one list
router.get('/:id', listsController.getListById);

// Get cards on list
router.get('/:id/cards', cardsController.getCardsByListId);

// Create card on list
router.post('/:id/cards', listsController.createCardOnList);

// Update one list
router.put('/:id', listsController.updateList);

// Delete one list
router.delete(
  '/:id',
  boardsController.deleteListsOnBoard,
  listsController.deleteList
);

module.exports = router;
