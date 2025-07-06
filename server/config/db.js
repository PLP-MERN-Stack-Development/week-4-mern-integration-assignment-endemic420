const mongoose = require ("mongoose");

//connection to mongoDB
const connectDB = async ()=>{
    try{
        await mongoose.connect(Process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error("MongoDB connection failed", error.message);
        Process.exit(1);
    }
};

module.exports = connectDB;