const mongoose = require('mongoose');

// Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    address: {
        type: Array
    },
    phone: {
        type: String
    },
    userType: {
        type: String,
        required: [true, 'User Type is required'],
        default: 'client',
        enum: ['client', 'admin', 'vendor', 'driver']
    },
    profile: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png'
    }
}, {timestamps: true})

module.exports = mongoose.model('Users', userSchema);