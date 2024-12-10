const mongoose = require('mongoose');

// Schema
const restaurantSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
        type: String,
        required: [true, " Resturant title is required"],
    },
    imageUrl: {
        type: String,
    },
    openingtime: {
        type: String,
    },
    closingtime: {
        type: String,
    },
    pickup: {
        type: Boolean,
        default: true,
    },
    delivery: {
        type: Boolean,
        default: true,
    },
    dining: {
        type: Boolean,
        default: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    logoUrl: {
        type: String,
    },
    rating: {
        type: Number,
        default: 1,
        min: 1,
        max: 5,
    },
    coords: {
        id: { type: String },
        latitude: { type: Number },
        latitudeDelta: { type: Number },
        longitude: { type: Number },
        longitudeDelta: { type: Number },
        address: { type: String },
        title: { type: String },
    },
}, { timestamps: true })

module.exports = mongoose.model('Restaurant', restaurantSchema);