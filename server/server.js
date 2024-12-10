const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// dot env config
dotenv.config();

// Connection
connectDB();

// Rest Object
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/auth', require("./src/routes/authRoutes"));
app.use('/api/v1/user', require('./src/routes/userRoutes'));
app.use('/api/v1/restaurant', require('./src/routes/restaurantRoutes'));
app.use('/api/v1/foodmenu', require('./src/routes/foodmenuRoute'));
app.use('/api/v1/orders', require('./src/routes/ordersRoutes'));

// Route
app.get('/', (req, res) => {
    return res.status(200).send("<h1>Welcome to RestroHuts server App</h1>");
});

// PORT
const PORT = process.env.PORT || 5005;

// Listen 
app.listen(PORT, () => {
    console.log(`Server is Runing on ${PORT}`);
})