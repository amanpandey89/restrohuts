const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

// User Register Controller
const registerController = async (req, res) => {
    try {
        const {username, email, password, phone} = req.body
        // Validation
        if(!username || !email || !password || !phone) {
            return res.status(500).send({
                success: false,
                message: "Please Provide All Fields"
            })
        }
        // Check User
        const exsiting = await userModel.findOne({email});
        if(exsiting) {
            return res.status(500).send({
                success: false,
                message: "Email Already Registerd, Please Login"
            })
        }
        var salt = bcrypt.genSaltSync(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        // Create User
        const user = await userModel.create({username, email, password:hashedpassword, phone});
        res.status(200).send({
            success: true,
            message: "Successfully Registered",
            user
        })
    } catch (error) {
        console.log("Error in register "+error);
        res.status(500).send({
            success: false,
            message: "Error In Register App",
            error
        })
    }
};

// User Login Controller
const loginController = async (req, res) => 
{
    try {
        const {email, password} = req.body;
        // Validation
        if(!email || !password) {
            return res.status(500).send({
                success: false,
                message: "Please provide Email and Password"
            })
        }
        // Check User
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success: false,
                message: "User Not Found"
            })
        }
        // Check Hash password before login
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invaild Credentails",
            })
        }
        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        user.password = undefined
        res.status(200).send({
            success: true,
            message: "User login Successfully",
            token,
            user
        })
    } catch (error) {
        console.log("Error in login ", error);
        res.status(500).send({
            success: false,
            message: "Error in login API",
            error
        })
    }
};
module.exports = {registerController, loginController};