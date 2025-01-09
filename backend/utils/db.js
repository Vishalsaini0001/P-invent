const chalk = require("chalk");
const mongoose = require("mongoose");

const ConnectDb = async ()=>{
    try {
       await mongoose.connect(process.env.MONGODB_URI);
        console.log(chalk.bgCyan("MongoDb Connected..."));
    } catch (error) {
        console.log(chalk.red("MongoDb connection failed!",error));
    }
}

module.exports = ConnectDb;