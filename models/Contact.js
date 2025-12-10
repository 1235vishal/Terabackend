const pool = require('../config/database.js');

const Contact = {
    createTable: async () => {
        const conn = await pool.getConnection();
        try {
            const sql = `
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(64),
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          is_read TINYINT(1) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
            await conn.query(sql);
            console.log('✓ Contacts table ready');
        } finally {
            conn.release();
        }
    },

    create: async ({ name, email, phone, subject, message }) => {
        const conn = await pool.getConnection();
        try {
            const [res] = await conn.query(
                'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
                [name, email, phone || null, subject, message]
            );
            return { id: res.insertId };
        } finally {
            conn.release();
        }
    },

    list: async () => {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(
                'SELECT id, name, email, phone, subject, message, is_read AS isRead, created_at AS createdAt FROM contacts ORDER BY created_at DESC'
            );
            return rows;
        } finally {
            conn.release();
        }
    },

    markRead: async (id) => {
        const conn = await pool.getConnection();
        try {
            const [res] = await conn.query('UPDATE contacts SET is_read = 1 WHERE id = ?', [id]);
            return { affectedRows: res.affectedRows };
        } finally {
            conn.release();
        }
    }
};

module.exports = Contact;
