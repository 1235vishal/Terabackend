const pool = require('../config/database.js');

const Catering = {
    createTable: async () => {
        const connection = await pool.getConnection();
        try {
            const createTableQuery = `
        CREATE TABLE IF NOT EXISTS catering_requests (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50) NOT NULL,
          persons INT NOT NULL,
          event_date DATE NOT NULL,
          event_location VARCHAR(255) NOT NULL,
          instructions TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
            await connection.query(createTableQuery);
            console.log('✓ Catering requests table ready');
        } catch (error) {
            console.error('Error creating catering_requests table:', error);
            throw error;
        } finally {
            connection.release();
        }
    },

    create: async (data) => {
        const connection = await pool.getConnection();
        try {
            const query = `
        INSERT INTO catering_requests
        (name, email, phone, persons, event_date, event_location, instructions)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
            const params = [
                data.name,
                data.email || null,
                data.phone,
                Number(data.persons),
                data.eventDate,
                data.eventLocation,
                data.instructions || null,
            ];
            const [result] = await connection.query(query, params);
            return { id: result.insertId };
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    list: async () => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT id, name, email, phone, persons, event_date AS eventDate, event_location AS eventLocation, instructions, created_at FROM catering_requests ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    findById: async (id) => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT id, name, email, phone, persons, event_date AS eventDate, event_location AS eventLocation, instructions, created_at FROM catering_requests WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },

    remove: async (id) => {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('DELETE FROM catering_requests WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    },
};

module.exports = Catering;
