const pool = require('../config/database.js');

const Update = {
    createTable: async () => {
        const conn = await pool.getConnection();
        try {
            const sql = `
        CREATE TABLE IF NOT EXISTS updates (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          full_details TEXT,
          tag VARCHAR(128),
          price VARCHAR(64),
          image_url VARCHAR(1024) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
            await conn.query(sql);
            console.log('✓ Updates table ready');
        } finally {
            conn.release();
        }
    },

    create: async ({ title, description, fullDetails, tag, price, imageUrl }) => {
        const conn = await pool.getConnection();
        try {
            const [res] = await conn.query(
                'INSERT INTO updates (title, description, full_details, tag, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                [title, description || null, fullDetails || null, tag || null, price || null, imageUrl]
            );
            return { id: res.insertId };
        } finally {
            conn.release();
        }
    },

    list: async () => {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query('SELECT id, title, description, full_details AS fullDetails, tag, price, image_url AS imageUrl, created_at FROM updates ORDER BY created_at DESC');
            return rows;
        } finally {
            conn.release();
        }
    },

    findById: async (id) => {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query('SELECT id, title, description, full_details AS fullDetails, tag, price, image_url AS imageUrl, created_at FROM updates WHERE id = ?', [id]);
            return rows[0] || null;
        } finally {
            conn.release();
        }
    },

    update: async (id, { title, description, fullDetails, tag, price, imageUrl }) => {
        const conn = await pool.getConnection();
        try {
            const fields = [];
            const params = [];
            if (title !== undefined) { fields.push('title = ?'); params.push(title); }
            if (description !== undefined) { fields.push('description = ?'); params.push(description || null); }
            if (fullDetails !== undefined) { fields.push('full_details = ?'); params.push(fullDetails || null); }
            if (tag !== undefined) { fields.push('tag = ?'); params.push(tag || null); }
            if (price !== undefined) { fields.push('price = ?'); params.push(price || null); }
            if (imageUrl !== undefined) { fields.push('image_url = ?'); params.push(imageUrl); }
            if (!fields.length) return { affectedRows: 0 };
            params.push(id);
            const [res] = await conn.query(`UPDATE updates SET ${fields.join(', ')} WHERE id = ?`, params);
            return { affectedRows: res.affectedRows };
        } finally {
            conn.release();
        }
    },

    remove: async (id) => {
        const conn = await pool.getConnection();
        try {
            const [res] = await conn.query('DELETE FROM updates WHERE id = ?', [id]);
            return { affectedRows: res.affectedRows };
        } finally {
            conn.release();
        }
    }
};

module.exports = Update;
