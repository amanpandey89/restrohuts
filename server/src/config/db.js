const mongoose = require('mongoose');

// Function to connect mongoose DB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`DB connected ${mongoose.connection.host} `);
    } catch (error) {
        console.log("DB Error: "+error);
    }
}
module.exports = connectDB;