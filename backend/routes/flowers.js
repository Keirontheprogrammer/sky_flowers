const express = require('express');

const router = express.Router();
const flowerController = require('../controllers/flowerController');

router.get('/', flowerController.getAllFlowers);

router.get('/:id', flowerController.getFlowerById);

router.post('/', flowerController.addFlower);

router.delete('/:id', flowerController.deleteFlower);

module.exports = router;