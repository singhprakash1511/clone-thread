const express = require('express')
const router = express.Router();

const {sendMessage, getMessages, getConversations} = require('../controllers/messageController')
const {protectRoute} = require('../middlerWare/protectRoute')

router.get('/conversations', protectRoute, getConversations);
router.get('/:otherUserId',protectRoute, getMessages);
router.post('/sendMessage', protectRoute, sendMessage);

module.exports = router;
