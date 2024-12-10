const express = require('express');
const {createFoodMenu, updateFoodMenu, getItemList} = require('../controllers/foodMenuController');
const router = express.Router();

// Create Food Menu Route
router.post('/create-menu-item', createFoodMenu);
// Update Menu Item
router.put('/update-menu-item', updateFoodMenu);
// Get Menu Item by Restaurant Id
router.get('/get-item-list/:restaurantId', getItemList);

module.exports = router;