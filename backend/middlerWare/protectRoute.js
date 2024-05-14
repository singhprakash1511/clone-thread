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

		// Verifying the JWT using the secret key stored in environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({
              success: false,
              message: "User not found"
            });
          }
		// Storing the decoded JWT payload in the request object for further use

        req.user = decoded;

        next();
    } catch (error) {
        console.log(error.message);
    }
}