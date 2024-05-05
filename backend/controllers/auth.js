const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require('mongoose');
const {uploadOnCloudinary} = require("../utils/cloudinary")

exports.getUser = async(req,res) => {
    //fetching user profile either with username or userId
    //query is either username or userId
    const {query} =req.params;
    
    try {
        let user;

        //query is userId
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        }else{
            user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
        }
        if(!user) {
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        return res.status(200).json({
            success:true,
            user
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.signUp = async (req,res) => {
    try {
        const {name, email, username ,password} =req.body;

        //check empty fields
        if(!name || !email || !username || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        //check user if already exists
        const user = await User.findOne({username});
        if(user){
            return res.status(409).json({
                success:false,
                message:"User already exists"
            })
        }

        //check email
        const existEmail = await User.findOne({email});
        if(existEmail){
            return res.status(409).json({
                success:false,
                message:"Email already used"
            })
        }

        //hashing password
        const hashPassword = await bcrypt.hash(password,10);


        //creating new user
        const newUser = new User({
            name,email,username,password:hashPassword,
            profilePic:"",
        });

        await newUser.save();
      
        if(newUser){
            const token = jwt.sign({ 
                _id: newUser._id,
                name:newUser.name,
                email:newUser.email,
                username:newUser.username,
                bio:newUser.bio,
                profilePic:newUser.profilePic},process.env.JWT_SECRET,{
                    expiresIn:"24h"
                })

                newUser.token = token
                newUser.password=undefined;
                await newUser.save();
                //set cookie for token and return success response
                res.cookie("token",token,{
                    httpOnly:true,
                    expires:new Date(Date.now() + 7*24*60*60*1000)
                }).status(200).json({
                    success:true,
                    token,
                    newUser,
                    message:'Login success'
                })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Invalid user data"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.logIn = async (req,res) => {
    try {
        //get username and password from the request body
        const {username,password} =req.body;

        //check if username or password is missing
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }

            // Generate JWT token and Compare Password
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign({ 
                _id: user._id,
                name:user.name,
                email:user.email,
                username:user.username,
                bio:user.bio,
                profilePic:user.profilePic},process.env.JWT_SECRET,{
                    expiresIn:"24h"
                })
      
                //save token to user document in database
                user.token = token;
                user.password=undefined

                //set cookie for token and return success response
                res.cookie("token",token,{
                    httpOnly:true,
                    expires:new Date(Date.now() + 7*24*60*60*1000)
                }).status(200).json({
                    success:true,
                    token,
                    user,
                    message:'Login success'
                })
        }else{
            return res.status(401).json({
                success:false,
                message:'wrong password'
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Login failed please try again",
        })
    }
}

exports.logout =async (req,res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token");

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        // If an error occurs, return internal server error response
        return res.status(500).json({
            success: false,
            message: "Logout failed. Please try again later."
        });
    }
}

exports.followUnFollow = async (req,res) => {
    const token = req.cookies.token;
    console.log("okay")

    try {
        const { id } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        const currentUserId = user._id;
        const targetUser = User.findById(id);
        console.log(id);
    
        if(id === currentUserId.toString()) {
            return res.status(400).json({
                success:false,
                message:"You can't follow/unfollow yourself"
            })
        }

        if(!id){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }
        
        // Get the current user with populated 'following' array
        const currentUser = await User.findById(currentUserId).populate('following');
        
        // Check if the current user is already following the target user
        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            //unfollow user
            await User.findByIdAndUpdate(id, {$pull: {followers: currentUserId}});
            await User.findByIdAndUpdate(currentUserId, {$pull: {following:id}});

            return res.status(200).json({
                success:true,
                message:"User unfollowed successfully"
            })
        }
        else{
            //follow user
            await User.findByIdAndUpdate(id,{$push: {followers: currentUserId}});
            await User.findByIdAndUpdate(currentUserId, {$push: {following:id}});

            return res.status(200).json({
                success:true,
                message:"User followed successfully",
                user,
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.updateUser = async (req,res) =>{
    try {
        const {name, email, username, bio} = req.body;
        let profilePic = req.file?.path;
        const userId = req.params.id;
        
        let user = await User.findById(userId);
     
        if(!user) {
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        if(req.params.id !== userId.toString()){
            return res.status(400).json({
                success:false,
                message:"You can't update other user's profile"
            })
        }

        if(name || username || email || bio){
            user.name = name || user.name;
            user.email = email || user.email;
            user.username = username || user.username;
            user.bio = bio || user.bio;
        }

        if(profilePic){
            const uploadedResponse = await uploadOnCloudinary(profilePic);
            profilePic = uploadedResponse.url;

            user.profilePic = profilePic || user.profilePic;
        }
            
        user = await user.save();

        return res.status(200).json({
            success:true,
            message:"Updated successfully",
            user : user
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}