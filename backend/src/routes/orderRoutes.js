const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get order by ID
router.get('/:orderId', orderController.getOrder);

// Get user orders
router.get('/', orderController.getUserOrders);

// Confirm payment
router.post('/:orderId/confirm', orderController.confirmPayment);

module.exports = router;
