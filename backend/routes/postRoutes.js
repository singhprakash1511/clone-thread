const express = require('express')
const router = express.Router();

const {createPost, getPost, deletePost, likeUnlikePost,replyToPost, getFeedPosts, getUserPosts} = require("../controllers/postController");
const {protectRoute} =require('../middlerWare/protectRoute');
const {upload} = require("../middlerWare/multer");

router.get("/feed",protectRoute,getFeedPosts);
router.get("/:id", getPost)
router.get("/user/:username", getUserPosts)
router.post("/create",upload.single("img"),createPost);
router.delete("/:id",protectRoute, deletePost);
router.put("/like/:id",protectRoute, likeUnlikePost);
router.put("/reply/:id",protectRoute, replyToPost);

module.exports = router;