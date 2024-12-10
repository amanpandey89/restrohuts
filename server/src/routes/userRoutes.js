const express = require('express');
const {getUserController, updateUserController, updateUserPassword, sendResetPasswordLink, resetPassword, deleteAccount} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes
// Get User
router.get('/getuser', authMiddleware, getUserController);

// Update Profile
router.put('/updateUser', authMiddleware, updateUserController);

// Update Password
router.post('/updatePassword', authMiddleware, updateUserPassword);

// Send Password Reset Link
router.post('/sendResetPasswordLink', authMiddleware, sendResetPasswordLink)

// Reset Password
router.post('/resetPassword', authMiddleware, resetPassword);

// Delete Account
router.delete('/deleteAccount/:id', authMiddleware, deleteAccount)

module.exports = router