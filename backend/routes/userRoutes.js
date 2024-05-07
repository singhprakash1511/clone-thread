const express = require("express");
const router = express.Router();

const {signUp,logIn,logout,followUnFollow,
           updateUser,getUser} = require('../controllers/auth'); 
const {protectRoute} = require('../middlerWare/protectRoute');
const {upload} =require("../middlerWare/multer.js")


router.get('/profile/:query',protectRoute,getUser);
router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', logout);
router.post('/follow/:id',protectRoute, followUnFollow);
router.post('/update/:id',protectRoute, upload.single("profilePic"), updateUser);

module.exports = router;