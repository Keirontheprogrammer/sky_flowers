const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/', customerController.findOrCreate);
router.get('/:id/orders', customerController.getCustomerOrders);

module.exports = router;   