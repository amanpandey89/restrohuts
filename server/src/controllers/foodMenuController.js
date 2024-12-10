const foodmenuModel = require("../models/foodmenuModel");

// Create A food menu Item
const createFoodMenu = async (req, res) => {
    try {
        const {restaurantId, name, category, mainImage, multipleImage, price, type, customizations} = req.body;
        if (!restaurantId || !name || !price || !type || !customizations ) {
            return res.status(400).send({
                success: false,
                message: "Please fill the required field"
            });
        }
        // Create Menu Item
        const createMenu = await foodmenuModel.create({restaurantId, name, category, mainImage, multipleImage, price, type, customizations});
        if (createMenu) {
            return res.status(200).send({
                success: false,
                message: "New Menu Item Is Created",
                newMenu: createMenu
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Create Food Menu API"
        })
    }
}

// Update Food Menu Item
const updateFoodMenu = async (req, res) => {
    try {
        const { foodMenuId, restaurantId, name, category, mainImage, price, type, customizations } = req.body;
        if (!foodMenuId) {
            return res.status(400).send({
                success: false,
                message: 'Food Menu ID is required',
            });
        }
        // Find the food menu item by ID
        const foodMenuItem = await foodmenuModel.findById(foodMenuId);
        if (!foodMenuItem) {
            return res.status(404).send({
                success: false,
                message: 'Food Menu item not found',
            });
        }
        // Update fields if provided
        if (restaurantId) foodMenuItem.restaurantId = restaurantId;
        if (name) foodMenuItem.name = name;
        if (category) foodMenuItem.category = category;
        if (mainImage) foodMenuItem.mainImage = mainImage;
        if (price) foodMenuItem.price = price;
        if (type) foodMenuItem.type = type;
        if (customizations) foodMenuItem.customizations = customizations;
        // Save the updated food menu item
        const updatedFoodMenu = await foodMenuItem.save();
        return res.status(200).send({
            success: true,
            message: 'Food Menu item updated successfully',
            data: updatedFoodMenu,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in food menu update"
        })
    }
}

// Get food menu item
const getItemList = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    if (!restaurantId) {
        return res.status(400).send({
            success: false,
            message: "Restaurant is required"
        });
    }
    // Get the list of menu item
    const menuItems = await foodmenuModel.find();
    if (menuItems.length > 0) {
        return res.status(200).send({
            success: true,
            message: "Menu item fatched successfully",
            menuItems: menuItems
        })
    } else {
        return res.status(404).send({
            success: false,
            message: "No Item Found"
        })
    }
}
module.exports = {createFoodMenu, updateFoodMenu, getItemList};