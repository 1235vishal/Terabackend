const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const pool = require('./config/database.js');
const Admin = require('./models/Admin.js');
const Catering = require('./models/Catering.js');
const Hero = require('./models/Hero.js');
const Menu = require('./models/Menu.js');
const Restaurant = require('./models/Restaurant.js');
const Update = require('./models/Update.js');
const adminRoutes = require('./routes/adminRoutes.js');
const cateringRoutes = require('./routes/cateringRoutes.js');
const contactRoutes = require('./routes/contactRoutes.js');
const heroRoutes = require('./routes/heroRoutes.js');
const menuRoutes = require('./routes/menuRoutes.js');
const restaurantRoutes = require('./routes/restaurantRoutes.js');
const updateRoutes = require('./routes/updateRoutes.js');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors({
//     origin: process.env.CORS_ORIGIN || 'http://localhost:5000',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// To this:
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // ✅ Frontend port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/contacts', contactRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Database initialization and server start
const startServer = async () => {
    try {
        // Test database connection
        const connection = await pool.getConnection();
        console.log('✓ Database connection successful');
        connection.release();

        // Create tables
        await Admin.createTable();
        await Catering.createTable();
        await Menu.createTable();
        await Restaurant.createTable();
        await Update.createTable();
        await Hero.createTable();
        const Contact = require('./models/Contact.js');
        await Contact.createTable();

        // Start server
        app.listen(PORT, () => {
            console.log(`✓ Server is running on http://localhost:${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✓ CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5000'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

// Start the server
startServer();

module.exports = app;
