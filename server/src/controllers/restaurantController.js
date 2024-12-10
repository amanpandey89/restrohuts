const restaurantModel = require("../models/restaurantModel");
const userModel = require("../models/userModel");
const foodmenuModel = require("../models/foodmenuModel");
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { registerController } = require("./authControllers");

// Create / Register Restaurant
const createRestaurant = async (req, res) => {
    try {
        const { vendor, restaurant, foodMenu } = req.body;
        // Check if vendor already exists
        let existingVendor = await userModel.findOne({ email: vendor.email }); // Find user by Email in User Collection
        if (!existingVendor) {
            // existingVendor = await userModel.create({ ...vendor, userType: 'vendor' }); // Used rest variable
            const {username, email, password, phone} = vendor;
            if(!username || !email || !password || !phone) {
                return res.status(500).send({
                    success: false,
                    message: "Please Provide All User Fields"
                });
            }
            var salt = bcrypt.genSaltSync(10);
            const hashedpassword = await bcrypt.hash(password, salt);
            existingVendor = await userModel.create({username, email, password:hashedpassword, phone, userType: 'vendor'});
        } else if (existingVendor.userType !== 'vendor') {
            return res.status(400).json({ message: 'User exists but is not a vendor.' });
        }
        // Create New Restaurant
        const newRestaurant = await restaurantModel.create({...restaurant, vendorId: existingVendor._id}) // Used rest variable
        if(newRestaurant) {
            const foodMenuData = foodMenu.map(item => ({
                ...item,
                restaurantId: newRestaurant._id // Link food menu to restaurant id
            }));
            const createFoodMenu = await foodmenuModel.insertMany(foodMenuData) // Bulk insert food menu ite,
            return res.status(201).send({
                message: 'Restaurant and Food menu created successfully.',
                restaurant: newRestaurant,
                foodMenu: createFoodMenu
            });
        } else {
            return res.status(400).send({
                message: 'Failed to create restaurant.'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Create Restaurant API"
        });
    }
}

// Get Restaurant details by Vendor login
const getVendorRestaurant = async (req, res) => {
    const vendorid = req.params.vendorid;
    const user = await userModel.findById({_id:vendorid});
    if (!user) {
        return res.status(404).send({
            message: "User Not Found"
        });
    }
    if(user.userType != 'vendor'){
        return res.status(201).send({
            message: "Current user is not a Vendor"
        });
    }
    // Get Restaurant Details
    const restaurantDetails = await restaurantModel.find({vendorId: vendorid});
    if(restaurantDetails) {
        // Get Restaurant Food Menu
        const restaurant = restaurantDetails[0];
        const formattedRestaurant = {
            ...restaurant._doc,
            _id: restaurant._id.toString() // Ensure the ID is a string
        };
        const restaurantFoodMenu = await foodmenuModel.find({restaurantId: restaurant._id});
        const combinedDetails = {
            ...formattedRestaurant,
            foodMenu: restaurantFoodMenu,
        };

        return res.status(200).send({
            message: "Restaurant Detail Fetched Successfully",
            restaurantDetails: combinedDetails
        });
    } else {
        return res.status(404).send({
            message: "Restaurant Not Found"
        });
    }
}

// Get All Restaurant List
const getAllRestaurant = async (req, res) => {
    try {
        // Get All restaurant List
        const restaurants = await restaurantModel.find();
        if (!restaurants || restaurants.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No Restaurant Found"
            })
        }

        // Get Food Menu of Restaurant
        const restaurantDetails = await Promise.all(
            restaurants.map( async (restaurant) => {
                // Fetch the food menu for each restaurant
                const foodMenu = await foodmenuModel.find({restaurantId: restaurant._id})
                
                // Add the food menu to the restaurant data
                return {
                    ...restaurant.toObject(), // Convert Mongoose document to plain object
                    foodMenu, // Add the food menu
                };
            })
        )

        // Return All Data
        return res.status(200).send({
            success: false,
            message: "All Restaurant Fetched Successfully",
            restaurants: restaurantDetails 
        });
    } catch (error) {
        console.log(error)
        return res.status(200).send({
            success: false,
            message: "Error in Restaurant Fetch API",
            error: error
        });
    }
}

// Update Single Restaurant Data
const updateRestaurant = async (req, res) => {
    try {
        // Find Restaurant
        const {restaurantId, ...updateFields} = req.body;
        
        // Check if restaurant Id Given or not
        if(!restaurantId) {
            return res.status(400).send({
                success: false,
                message: "Restaurant ID is missing."
            });
        }
        
        //  Validate if restaurant exist        
        const restaurant = await restaurantModel.findById(restaurantId);
        if(!restaurant) {
            return res.status(404).send({
                success: false,
                message: "Restaurant Not Found"
            });
        }

        // Update Restaurant Field
        const allowedFields = ["title","imageUrl","openingtime","closingtime","pickup","delivery","dining","isActive","logoUrl","rating","coords"];
        for (const field in updateFields) {
            if (allowedFields.includes(field)){
                restaurant[field] = updateFields[field];
            }
        }
        // Save Updated field of restaurant
        await restaurant.save();
        return res.status(200).send({
            success: true,
            message: "Restaurant Data Updated",
            restaurant: restaurant
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in the Restaurant API",
            error: error
        })
    }
}

// Delete Restaurant Data
const deleteRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantid;
        if (!restaurantId) {
            return res.status(400).send({
                success: false,
                message: "Restaurant ID is missing"
            })
        }
        await restaurantModel.findByIdAndDelete(restaurantId);
        return res.status(200).send({
            success: true,
            message: "Restaurant Delete Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in delete restaurant API"
        })
    }
}

module.exports = {createRestaurant, getVendorRestaurant, getAllRestaurant, updateRestaurant, deleteRestaurant};