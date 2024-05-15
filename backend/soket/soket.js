const {Server} = require('socket.io');
const http = require('http');
const express = require('express');
const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel")


const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET", "POST"]
    }
});


const userSocketMap = {} //userId: socketId

const getRecipientSocketId = (recipientId) => {
    if(!recipientId){
        console.log("missing")
    }
    return userSocketMap[recipientId];
} 


io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if(userId != "undefined") userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
         io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

module.exports= {io,server,app, getRecipientSocketId};