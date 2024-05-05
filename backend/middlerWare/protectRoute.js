const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.protectRoute = async (req,res,next) => {

    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;

        next();
    } catch (error) {
        console.log(error.message);
    }
}