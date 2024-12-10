const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {createRestaurant, getVendorRestaurant, getAllRestaurant, updateRestaurant, deleteRestaurant} = require('../controllers/restaurantController');
const router = express.Router();

// Create Restaurant
router.post('/create-restaurant', createRestaurant);

// Get Vendor Restaurant Details
router.get('/restaurant/:vendorid', authMiddleware, getVendorRestaurant);

// Get All Restaurant List
router.get('/allrestaurant/', authMiddleware, getAllRestaurant);

// Update Restarant Data
router.put('/update-restaurant/', authMiddleware, updateRestaurant);

// Delete Restaurant
router.delete('/delete-restaurant/:restaurantid', authMiddleware, deleteRestaurant);

module.exports = router;