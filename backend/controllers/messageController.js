const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { getRecipientSocketId, io } = require("../soket/soket");


exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, message } = req.body;
        const senderId = req.user._id;

        // Check if a conversation already exists between sender and recipient
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            });
            await conversation.save();
        }

        // Create and save a new message
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })
        ]);

        // Get the recipient's socket ID and emit the new message if they are online
        const recipientSocketId = getRecipientSocketId(recipientId);
    
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("newMessage", newMessage);
        }

        // Respond with the new message
        res.status(200).json(newMessage);

    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getMessages = async (req, res) => {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    try {
        // Find the conversation between the user and the other user
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        // If no conversation is found, respond with a 404 error
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // Get all messages for the conversation, sorted by creation date
        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: 1 });

        // Respond with the messages
        res.status(200).json(messages);

    } catch (error) {
        console.error("Error getting messages:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getConversations = async (req, res) => {
    const userId = req.user._id;

    try {
        // Get all conversations for the user, populating the participants field
        const conversations = await Conversation.find({ participants: userId }).populate({
            path: "participants",
            select: "username profilePic"
        });

        // Remove the current user from the participants array in each conversation
        conversations.forEach(conversation => {
            conversation.participants = conversation.participants.filter(
                participant => participant._id.toString() !== userId.toString()
            );
        });


        // Respond with the conversations
        res.status(200).json(conversations);

    } catch (error) {
        console.error("Error getting conversations:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
