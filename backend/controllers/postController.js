const User = require('../models/userModel');
const Post = require('../models/postModel');
const jwt = require('jsonwebtoken')
const {postUploadOnCloudinary} = require('../utils/cloudinary');
const cloudinary = require("cloudinary").v2;


exports.createPost = async (req,res) => {
    const token = req.cookies.token;
    try {
        console.log("h1")
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        const postedBy = user._id.toString();
        const {text} = req.body;
        
        let {img} = req.body
 
        if(!postedBy || !text){
            return res.status(400).json({
                success:false,
                message:"Posted and text fields are required"
            })
        }
        
        const currUser = await User.findById(postedBy);

        if(!currUser){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        if(currUser._id.toString() !== user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"Unauthorized to create post"
            })
        }

           if(img){
            const response = await postUploadOnCloudinary(img, "threads") ;
            img = response.url;
        }
    
        const newPost = new Post ({postedBy, text, img:img});
        await newPost.save();

        return res.status(201).json({
            message:"post uploaded",
            newPost,
        }
        )

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getPost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(400).json({
                success:false,
                message:"Post not found"
            });
        }

        return res.status(200).json({
            success:true,
            post
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.deletePost = async (req,res) => {
    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(400).json({
                success:false,
                message:"post not found"
            })
        }

        if(post.postedBy.toString() !== user._id.toString()){
            return res.status(400).json({
                success:false,
                message:"Unauthorized to delete post"
            })
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await  Post.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success:true,
            message:"post deleted"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.likeUnlikePost = async (req,res) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        const {id:postId} = req.params;
        const userId = user._id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(400).json({
                success:false,
                message:"Post not found"
            })
        }

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            //unlike post
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            return res.status(200).json({
                success:true,
                message:"Post unliked successfully"
            })
        }else{
            //like post
            post.likes.push(userId);

            await post.save();
            res.status(200).json({
                success:true,
                message:"Post liked successfully"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.replyToPost = async (req,res) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user= await User.findById(decoded._id);
        const userId = user._id.toString();
        const {text} = req.body;
        const postId = req.params.id;
        const userProfilePic = user.profilePic;
        const username = user.username;

        if(!text){
            return res.status(400).json({
                success:false,
                message:"Text is required"
            })
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({success:false,
            message:"post not found"
            })
        }

        const reply = {username,userProfilePic,text,userId};
        post.replies.push(reply);

        await post.save();

        return res.status(200).json({
            success:true,
            message:"reply done ",
            post
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getUserPosts = async (req,res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        const posts = await Post.find({postedBy:user._id}).sort({createdAt:-1});

        res.status(200).json(posts);
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }  
}

exports.getFeedPosts = async (req,res) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ $or: [{ postedBy: { $in: following } }, { postedBy: user._id }] }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}