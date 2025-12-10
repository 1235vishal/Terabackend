const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();


// Add this for debugging
console.log('=== DATABASE CONFIG DEBUG ===');
console.log('DB_HOST from env:', process.env.DB_HOST || 'NOT SET');
console.log('DB_USER from env:', process.env.DB_USER ? 'Set' : 'NOT SET');
console.log('DB_NAME from env:', process.env.DB_NAME || 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

const pool = mysql.createPool({
    host: process.env.DB_HOST, // ← REMOVE || 'localhost' from here!
    user: process.env.DB_USER, // ← Make sure this is correct
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { rejectUnauthorized: false } // ✅ REQUIRED for Hostinger
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ DATABASE CONNECTION FAILED:');
        console.error('Error:', err.message);
        console.error('Code:', err.code);
        console.error('Current DB_HOST:', process.env.DB_HOST || 'NOT SET');
        console.error('Current DB_USER:', process.env.DB_USER || 'NOT SET');

        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Troubleshooting: Check DB_USER and DB_PASSWORD');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Troubleshooting: Check DB_HOST and Remote MySQL access');
        }
        process.exit(1);
    } else {
        console.log('✅ Database connected successfully!');
        console.log('✅ Connected to host:', process.env.DB_HOST);
        connection.release();
    }
});

module.exports = pool;