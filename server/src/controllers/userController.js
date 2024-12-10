const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

const getUserController = async (req, res) => {
    try {
        const user = await userModel.findById({_id:req.body.id})
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found"
            })
        }
        // hide password
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: "User Data Succesfully",
            user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in Get User API',
            error
        })
        console.log(error)
    }
};

// Update User
const updateUserController = async (req, res) => {
    try {
        // Find User
        const user = await userModel.findById({_id: req.body.id})
        // Validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found"
            })
        }
        // Update User
        const {username, address, phone, userType} = req.body;
        if (username) user.username = username;
        if (address) user.address = address;
        if (phone) user.phone = phone;
        if (userType) user.userType = userType;
        // Save USer
        await user.save()
        res.status(200).send({
            success: true,
            message: "User Updated Successfully",
            user
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in Get User API',
            error
        })
        console.log(error)
    }
};

// Update User Password
const updateUserPassword = async (req, res) => {
    try {
        // Find User
        const user = await userModel.findById({_id: req.body.id});
        if(!user){
            return res.status(404).send({
                success: false,
                message: "User Not Found"
            });
        }
        // Get Data
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please fill the required field"
            })
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invaild Old Password",
            })
        }
        var salt = bcrypt.genSaltSync(10);
        const hashedpassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedpassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Updated"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Password Update API faild",
            error
        })
    }
}

// Send Reset Password Link
const sendResetPasswordLink = async (req, res) => {
    try {
        const user = await userModel.findById({_id: req.body.id});
        if(!user){
            return res.status(404).send({
                success: false,
                message: "User Not Found"
            })
        }
        const email = req.body.email;
        if (!email || email !== user.email) {
            return res.status(500).send({
                success: false,
                message: "Invalid email address provided"
            })
        }

        // Generate the token for user verfication
        const token = JWT.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"} );

        const resetLink = `http://yourfrontend.com/reset-password?token=${token}`;
        // Send the link in the response (for now, without email integration)
        return res.status(200).send({
            success: true,
            message: "Password reset link generated successfully",
            resetLink: resetLink
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Reset Password Link Send API",
            error: error
        })
    }
}

// Reset Password
const resetPassword = async (req, res) => {
    try {
        // Get The details from body
        const {token, newPassword} = req.body;

        // Validate Input
        if (!token || !newPassword) {
            return res.status(404).send({
                success: false,
                message: "Token and new password are required"
            });
        }

        // Verfiy and decode the token
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user
        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }

        // Hast The new pass
        var salt = bcrypt.genSaltSync(10);
        const hashedpassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedpassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "New Password Updated"
        })
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            success: false,
            message: "Error in the User Password Link API",
            error: error
        })
    }
}

// Delete Account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: "Your Account Deleted Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Account delete API",
            error: error
        });
    }
}

module.exports = { getUserController, updateUserController, updateUserPassword, sendResetPasswordLink, resetPassword, deleteAccount };