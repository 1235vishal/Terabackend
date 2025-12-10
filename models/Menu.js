const pool = require('../config/database.js');

const Menu = {
    createTable: async () => {
        const connection = await pool.getConnection();
        try {
            const sql = `
        CREATE TABLE IF NOT EXISTS menus (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          image_url VARCHAR(1024) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
            await connection.query(sql);
            console.log('✓ Menus table ready');
        } finally {
            connection.release();
        }
    },

    create: async ({ name, imageUrl }) => {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO menus (name, image_url) VALUES (?, ?)',
                [name, imageUrl]
            );
            return { id: result.insertId };
        } finally {
            connection.release();
        }
    },

    list: async () => {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT id, name, image_url AS imageUrl, created_at FROM menus ORDER BY created_at DESC'
            );
            return rows;
        } finally {
            connection.release();
        }
    },

    remove: async (id) => {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query('DELETE FROM menus WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }
};

module.exports = Menu;
