const mongoose = require("mongoose");

const ConnectDb = async ()=>{
    try {
       await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDb Connected...");
    } catch (error) {
        console.log("MongoDb connection failed!",error)
    }
}

module.exports = ConnectDb;