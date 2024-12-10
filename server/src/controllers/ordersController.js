const foodmenuModel = require("../models/foodmenuModel");
const ordersModel = require("../models/ordersModel");
const orderModel = require("../models/ordersModel");
const restaurantModel = require("../models/restaurantModel");
const userModel = require("../models/userModel");

// Create New Order
const createOrder = async (req, res) => {
    try {
        const {orderNumber,customerId,restaurantId,items,paymentMethod,deliveryAddress,deliveryCoordinates,pickup} = req.body;
        // Validate required field
        if (!orderNumber || !customerId || !restaurantId || !items || !paymentMethod) {
            return res.status(400).send({
                success: false,
                message: "Missing required field"
            })
        }
        // Check if customer exist
        const customer = await userModel.findById(customerId);
        if(!customer) {
            return res.status(404).send({
                success: false,
                message: 'Customer not found.'
            })
        }
        // Check if restaurant exist
        const restaurant = await restaurantModel.findById(restaurantId);
        if(!restaurant) {
            return res.status(404).send({
                success: false,
                message: 'Restaurant not found.'
            })
        }
        // Validate and order total calculation
        let totalAmount = 0;
        const validateItems = await Promise.all(
            items.map(async (item) => {
                const food = await foodmenuModel.findById(item.foodId);
                if(!food){
                    throw new Error(`Food item with ID ${item.foodId} not found.`);
                }
                return {
                    ...item,
                    price: food.price,
                    totalPrice: food.price * item.quantity
                }
            })
        );
        // Total Amount
        totalAmount = validateItems.reduce((sum, item) => sum + item.totalPrice, 0);
        // Create Order
        const order = await ordersModel.create({
            orderNumber,
            customerId,
            restaurantId,
            items: validateItems,
            totalAmount,
            paymentMethod,
            deliveryAddress,
            deliveryCoordinates,
            pickup
        });
        return res.status(200).send({
            success: true,
            message: "Order Create Successfully.",
            orderNumber: orderNumber
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in create order API"
        })
    }
}

// Get Order by User - For Frontend
const getAllOrders = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        if(!customerId) {
            return res.status(400).send({
                success: false,
                message: "Customer Id missing"
            });
        }
        const orders = await orderModel.find({customerId: customerId});
        if (orders && orders.length > 0) {
            return res.status(200).send({
                success: true,
                message: "Order Fetched Successfully",
                orders: orders
            })            
        } else {
            return res.status(404).send({
                success: false,
                message: "No Order Found",
                orders: orders
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Fetch Order API"
        })
    }
}

// Get Order by Restaurant - For Frontend
const getRestaurantOrders = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        if(!restaurantId) {
            return res.status(400).send({
                success: false,
                message: "Restaurant Id missing"
            });
        }
        const orders = await orderModel.find({restaurantId: restaurantId});
        if (orders && orders.length > 0) {
            return res.status(200).send({
                success: true,
                message: "Order Fetched Successfully",
                orders: orders
            })            
        } else {
            return res.status(404).send({
                success: false,
                message: "No Order Found",
                orders: orders
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Fetch Order API"
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const {orderId, status, paymentStatus} = req.body;
        if(!orderId) {
            return res.status(400).send({
                success: false,
                message: "Order Id missing",
            });
        }
        if (!status || !paymentStatus) {
            return res.status(400).send({
                success: false,
                message: "Please Select any status",
            });
        }
        // Update Order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).send({
                success: false,
                message: "Order not found",
            });
        }
        // Update the order fields
        order.status = status;
        order.paymentStatus = paymentStatus;
        // Save the updated order
        await order.save();
        return res.status(200).send({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in the Order Update API"
        })
    }
}

module.exports = {createOrder, getAllOrders, getRestaurantOrders, updateOrderStatus};