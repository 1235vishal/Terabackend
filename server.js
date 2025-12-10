// const cors = require('cors');
// const dotenv = require('dotenv');
// const express = require('express');
// const path = require('path');
// const pool = require('./config/database.js');
// const Admin = require('./models/Admin.js');
// const Catering = require('./models/Catering.js');
// const Hero = require('./models/Hero.js');
// const Menu = require('./models/Menu.js');
// const Restaurant = require('./models/Restaurant.js');
// const Update = require('./models/Update.js');
// const adminRoutes = require('./routes/adminRoutes.js');
// const cateringRoutes = require('./routes/cateringRoutes.js');
// const contactRoutes = require('./routes/contactRoutes.js');
// const heroRoutes = require('./routes/heroRoutes.js');
// const menuRoutes = require('./routes/menuRoutes.js');
// const restaurantRoutes = require('./routes/restaurantRoutes.js');
// const updateRoutes = require('./routes/updateRoutes.js');

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// // app.use(cors({
// //     origin: process.env.CORS_ORIGIN || 'http://localhost:5000',
// //     credentials: true,
// //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
// //     allowedHeaders: ['Content-Type', 'Authorization']
// // }));
// // To this:
// app.use(cors({
//     origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // ✅ Frontend port
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Static files for uploads
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// // Routes
// app.use('/api/admin', adminRoutes);
// app.use('/api/catering', cateringRoutes);
// app.use('/api/menu', menuRoutes);
// app.use('/api/restaurants', restaurantRoutes);
// app.use('/api/updates', updateRoutes);
// app.use('/api/hero', heroRoutes);
// app.use('/api/contacts', contactRoutes);

// // Health check route
// app.get('/api/health', (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: 'Server is running'
//     });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//         error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route not found'
//     });
// });

// // Database initialization and server start
// const startServer = async () => {
//     try {
//         // Test database connection
//         const connection = await pool.getConnection();
//         console.log('✓ Database connection successful');
//         connection.release();

//         // Create tables
//         await Admin.createTable();
//         await Catering.createTable();
//         await Menu.createTable();
//         await Restaurant.createTable();
//         await Update.createTable();
//         await Hero.createTable();
//         const Contact = require('./models/Contact.js');
//         await Contact.createTable();

//         // Start server
//         app.listen(PORT, () => {
//             console.log(`✓ Server is running on http://localhost:${PORT}`);
//             console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
//             console.log(`✓ CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5000'}`);
//         });
//     } catch (error) {
//         console.error('Failed to start server:', error.message);
//         process.exit(1);
//     }
// };

// // Start the server
// startServer();

// module.exports = app;



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
const PORT = process.env.PORT || 10000; // Changed to 10000 for Render

// Debug: Log environment status
console.log('=== ENVIRONMENT CHECK ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('DB_HOST:', process.env.DB_HOST ? 'Set' : 'NOT SET - THIS IS THE PROBLEM!');
console.log('DB_USER:', process.env.DB_USER ? 'Set' : 'NOT SET');
console.log('DB_NAME:', process.env.DB_NAME ? 'Set' : 'NOT SET');
console.log('PORT:', PORT);

// Middleware
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
        message: 'Server is running',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Database test route (for debugging)
app.get('/api/test-db', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT NOW() as current_time, 1 as test_value');
        connection.release();
        res.json({
            success: true,
            message: 'Database connected',
            data: rows[0],
            dbHost: process.env.DB_HOST ? 'Set' : 'Not set'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
            code: error.code
        });
    }
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

// Async function to create tables
async function createTables() {
    try {
        console.log('Starting table creation...');
        await Admin.createTable();
        await Catering.createTable();
        await Menu.createTable();
        await Restaurant.createTable();
        await Update.createTable();
        await Hero.createTable();
        const Contact = require('./models/Contact.js');
        await Contact.createTable();
        console.log('✅ All tables created successfully');
    } catch (tableError) {
        console.warn('⚠️ Table creation error (non-fatal):', tableError.message);
        console.log('Server continues running despite table errors...');
    }
}

// Database initialization and server start
const startServer = async () => {
    console.log('=== STARTING SERVER WITH DETAILED DEBUGGING ===');

    try {
        // Test database connection with detailed logging
        console.log('Attempting database connection...');
        console.log('Connection details:');
        console.log('- Host:', process.env.DB_HOST || 'MISSING!');
        console.log('- User:', process.env.DB_USER ? '***' : 'MISSING!');
        console.log('- Database:', process.env.DB_NAME || 'MISSING!');
        console.log('- Port:', process.env.DB_PORT || 3306);

        const connection = await pool.getConnection();
        console.log('✅ Database connection successful!');

        // Test with a simple query
        const [rows] = await connection.query('SELECT 1 as test, NOW() as db_time');
        console.log('✅ Test query successful. DB time:', rows[0].db_time);
        connection.release();

        // Start server FIRST
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✅ CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
            console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
            console.log(`✅ DB test: http://localhost:${PORT}/api/test-db`);

            // Create tables in background (non-blocking)
            createTables().then(() => {
                console.log('✅ Server setup complete!');
            });
        });

    } catch (error) {
        console.error('❌❌❌ FATAL STARTUP ERROR ❌❌❌');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code || 'No code');
        console.error('Error stack:', error.stack);

        // Specific troubleshooting based on error
        if (error.code === 'ECONNREFUSED') {
            console.error('\n🔧 TROUBLESHOOTING: ECONNREFUSED');
            console.error('1. Check DB_HOST is correct in Render environment variables');
            console.error('2. Enable Remote MySQL in Hostinger with % wildcard');
            console.error('3. Verify Hostinger MySQL server is running');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n🔧 TROUBLESHOOTING: ACCESS DENIED');
            console.error('1. Check DB_USER and DB_PASSWORD in Render');
            console.error('2. Use FULL username from Hostinger (u123456789_username)');
            console.error('3. Verify password is correct');
        } else if (!process.env.DB_HOST) {
            console.error('\n🔧 TROUBLESHOOTING: MISSING ENV VARIABLES');
            console.error('1. DB_HOST is not set in Render environment variables');
            console.error('2. Go to Render dashboard → Environment tab');
            console.error('3. Add all required database variables');
        }

        console.error('\n📋 Required Render Environment Variables:');
        console.error('DB_HOST=your_host.mysql.hostinger.com');
        console.error('DB_USER=u123456789_username (FULL username)');
        console.error('DB_PASSWORD=your_password');
        console.error('DB_NAME=u123456789_database (FULL db name)');
        console.error('DB_PORT=3306');
        console.error('PORT=10000');
        console.error('NODE_ENV=production');

        process.exit(1);
    }
};

// Start the server
startServer();

module.exports = app;