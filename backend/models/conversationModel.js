const mongoose = require("mongoose")

const conversationSchema = mongoose.Schema({
    participants: [
        {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    }],
    lastMessage: {
        text: String,
        sender: {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
}, {
    timestamps:true
})


module.exports = mongoose.model("Conversation", conversationSchema);