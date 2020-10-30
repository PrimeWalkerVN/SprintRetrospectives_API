const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cardsController');

// Get all Card
router.get('/', cardsController.getAllsCards);

// Get one Card
router.get('/:id', cardsController.getCardById);

// Update one Card
router.put('/:id', cardsController.updateCard);

// Delete one Card
router.delete('/:id', cardsController.deleteCard);

module.exports = router;
