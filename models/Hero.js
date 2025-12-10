const db = require('../config/database.js');

const Hero = {
    async createTable() {
        const conn = await db.getConnection();
        try {
            await conn.query(`
        CREATE TABLE IF NOT EXISTS hero (
          id INT AUTO_INCREMENT PRIMARY KEY,
          imageUrl VARCHAR(255) NOT NULL,
          title VARCHAR(255) NULL,
          subtitle VARCHAR(255) NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
        } finally {
            conn.release();
        }
    },

    async getLatest() {
        const conn = await db.getConnection();
        try {
            const [rows] = await conn.query('SELECT * FROM hero ORDER BY created_at DESC LIMIT 1');
            return rows[0] || null;
        } finally {
            conn.release();
        }
    },

    async create({ imageUrl, title, subtitle }) {
        const conn = await db.getConnection();
        try {
            const [result] = await conn.query(
                'INSERT INTO hero (imageUrl, title, subtitle) VALUES (?, ?, ?)',
                [imageUrl, title || null, subtitle || null]
            );
            return { id: result.insertId, imageUrl, title, subtitle };
        } finally {
            conn.release();
        }
    },

    async updateLatest({ imageUrl, title, subtitle }) {
        const current = await Hero.getLatest();
        if (!current) {
            return Hero.create({ imageUrl, title, subtitle });
        }
        const conn = await db.getConnection();
        try {
            await conn.query(
                'UPDATE hero SET imageUrl = ?, title = ?, subtitle = ? WHERE id = ?',
                [imageUrl, title || null, subtitle || null, current.id]
            );
            return { id: current.id, imageUrl, title, subtitle };
        } finally {
            conn.release();
        }
    },
};

module.exports = Hero;
