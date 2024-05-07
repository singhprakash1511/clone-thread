const mongoose = require("mongoose");

 exports.connectDB =async () => {
    mongoose.connect(process.env.MONGODB_URL)
   .then(() => console.log("DB connected successfully"),{
      useNewUrlParser: true,
      useUnifiedTopology:true,
   })
   .catch((error) =>  {
    console.log("DB Connection Failed")
    console.log(error);
    process.exit(1);
   })
}

