const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'srv1497.hstgr.io',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'u484397615_Tera',
    password: process.env.DB_PASSWORD || 'Tera@1235',
    database: process.env.DB_NAME || 'u484397615_Tera',
    ssl: {
        rejectUnauthorized: false // Required for Hostinger
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;


