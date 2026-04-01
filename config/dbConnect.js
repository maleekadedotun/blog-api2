const mongoose = require("mongoose");


// function to connect to database
const dbConnect = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully");
        
    } catch (error) {
        console.log(error.message);
        
    }
}

dbConnect();
// module.exports dbConnect;