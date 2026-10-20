const mongoose = require('mongoose')

async function connectMongoose() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Connected Successfully");
        
    } catch (error) {
        console.log("MondoDB Connection Failed:",error.message);
        
    }
}


module.exports = connectMongoose