const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');


const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    connectDB();
});

