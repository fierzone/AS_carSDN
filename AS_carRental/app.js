require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routes (Mới)
const authRoutes = require('./routes/apiAuthRoutes');
const carRoutes = require('./routes/apiCarRoutes');
const bookingRoutes = require('./routes/apiBookingRoutes');
const statsRoutes = require('./routes/apiStatsRoutes');
const userRoutes = require('./routes/apiUserRoutes');



const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carRentalDB')
    .then(() => console.log('Connected to MongoDB (Unified Server)'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve giao diện Front-End tĩnh (HTML, CSS, JS) từ thư mục frontend-template
app.use(express.static(path.join(__dirname, 'frontend-template')));

// API Routes (Mới - Tách rời theo chuẩn REST API)
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);


// Bất kỳ route nào không khớp với API -> Trả về giao diện Front-End file index.html
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend-template', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`- Front-End View: http://localhost:${PORT}`);
    console.log(`- API Endpoint: http://localhost:${PORT}/api/`);
});

module.exports = app;
