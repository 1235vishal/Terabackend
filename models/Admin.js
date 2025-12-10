const pool = require('../config/database.js');

const Admin = {
    // Auto create table if not exists
    createTable: async () => {
        const connection = await pool.getConnection();
        try {
            const createTableQuery = `
        CREATE TABLE IF NOT EXISTS admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;

            await connection.query(createTableQuery);
            console.log('✓ Admins table created or already exists');
        } catch (error) {
            console.error('Error creating admins table:', error);
        } finally {
            connection.release();
        }
    },

    // Create a new admin
    create: async (name, email, hashedPassword) => {
        const connection = await pool.getConnection();
        try {
            const query = 'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)';
            const [result] = await connection.query(query, [name, email, hashedPassword]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    // Find admin by email
    findByEmail: async (email) => {
        const connection = await pool.getConnection();
        try {
            const query = 'SELECT * FROM admins WHERE email = ?';
            const [rows] = await connection.query(query, [email]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    // Find admin by ID
    findById: async (id) => {
        const connection = await pool.getConnection();
        try {
            const query = 'SELECT id, name, email, created_at FROM admins WHERE id = ?';
            const [rows] = await connection.query(query, [id]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    // Update admin
    update: async (id, name, email) => {
        const connection = await pool.getConnection();
        try {
            const query = 'UPDATE admins SET name = ?, email = ? WHERE id = ?';
            const [result] = await connection.query(query, [name, email, id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    // Delete admin
    delete: async (id) => {
        const connection = await pool.getConnection();
        try {
            const query = 'DELETE FROM admins WHERE id = ?';
            const [result] = await connection.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    // Get all admins
    getAll: async () => {
        const connection = await pool.getConnection();
        try {
            const query = 'SELECT id, name, email, created_at FROM admins';
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = Admin;
