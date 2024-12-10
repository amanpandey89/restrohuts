const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {createOrder, getAllOrders, getRestaurantOrders, updateOrderStatus} = require('../controllers/ordersController');
const router = express.Router();

// Create Order
router.post('/create-order', authMiddleware, createOrder)

// Get Order Listing - For Frontend user
router.get('/all-orders/:customerId', authMiddleware, getAllOrders);

// Get All Order Listing - For Restaurant Admin Panel
router.get('/restaurant-orders/:restaurantId', authMiddleware, getRestaurantOrders);

// Update Order status
router.put('/update-order-status', authMiddleware, updateOrderStatus)

module.exports = router;