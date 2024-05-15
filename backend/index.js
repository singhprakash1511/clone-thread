require("dotenv").config();
const express = require("express");
const PORT=process.env.PORT || 5000;
const database = require("./config/configDB");
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");
const {app, server} = require("./soket/soket")


//connection to the database
database.connectDB();

//middleware
app.use(express.json({ limit: "20mb" })) //To parse JSON data in the req.body
app.use(express.urlencoded({extended:true})); //To parse form data in the req.body
app.use(cookieParser());
app.use(express.static("public"))


//Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/message', messageRoutes);

server.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
})



