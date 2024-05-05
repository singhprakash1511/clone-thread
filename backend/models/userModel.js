const mongoose =require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true,
        index:true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    profilePic: {
        type: String,
    },
    followers: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
    },
},{
    timestamps:true,
})

module.exports = mongoose.model('User', userSchema);