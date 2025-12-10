const pool = require('../config/database.js');

const Restaurant = {
    createTable: async () => {
        const conn = await pool.getConnection();
        try {
            const sql = `
        CREATE TABLE IF NOT EXISTS restaurants (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          branches INT DEFAULT 0,
          image_url VARCHAR(1024) NOT NULL,
          locations TEXT,
          description TEXT,
          why_choose_us TEXT,
          phone VARCHAR(64),
          hours VARCHAR(128),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
            await conn.query(sql);
            // Ensure columns exist for older tables
            const [cols] = await conn.query(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'restaurants'"
            );
            const names = new Set(cols.map(c => c.COLUMN_NAME));
            const alters = [];
            if (!names.has('description')) alters.push("ADD COLUMN description TEXT");
            if (!names.has('why_choose_us')) alters.push("ADD COLUMN why_choose_us TEXT");
            if (!names.has('phone')) alters.push("ADD COLUMN phone VARCHAR(64)");
            if (!names.has('hours')) alters.push("ADD COLUMN hours VARCHAR(128)");
            if (alters.length) {
                await conn.query(`ALTER TABLE restaurants ${alters.join(', ')}`);
            }
            console.log('✓ Restaurants table ready');
        } finally {
            conn.release();
        }
    },

    create: async ({ name, branches, imageUrl, locations, description, whyChooseUs, phone, hours }) => {
        const conn = await pool.getConnection();
        try {
            const locStr = Array.isArray(locations) ? JSON.stringify(locations) : '[]';
            const whyStr = Array.isArray(whyChooseUs) ? JSON.stringify(whyChooseUs) : '[]';
            const [res] = await conn.query(
                'INSERT INTO restaurants (name, branches, image_url, locations, description, why_choose_us, phone, hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, Number(branches) || 0, imageUrl, locStr, description || null, whyStr, phone || null, hours || null]
            );
            return { id: res.insertId };
        } finally {
            conn.release();
        }
    },

    list: async () => {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query('SELECT id, name, branches, image_url AS imageUrl, locations, description, why_choose_us AS whyChooseUs, phone, hours, created_at FROM restaurants ORDER BY created_at DESC');
            return rows.map(r => ({
                ...r,
                locations: (() => { try { return JSON.parse(r.locations || '[]'); } catch { return []; } })(),
                whyChooseUs: (() => { try { return JSON.parse(r.whyChooseUs || '[]'); } catch { return []; } })(),
            }));
        } finally {
            conn.release();
        }
    },

    findById: async (id) => {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query('SELECT id, name, branches, image_url AS imageUrl, locations, description, why_choose_us AS whyChooseUs, phone, hours, created_at FROM restaurants WHERE id = ?', [id]);
            if (!rows.length) return null;
            const r = rows[0];
            return {
                ...r,
                locations: (() => { try { return JSON.parse(r.locations || '[]'); } catch { return []; } })(),
                whyChooseUs: (() => { try { return JSON.parse(r.whyChooseUs || '[]'); } catch { return []; } })(),
            };
        } finally {
            conn.release();
        }
    },

    update: async (id, { name, branches, imageUrl, locations, description, whyChooseUs, phone, hours }) => {
        const conn = await pool.getConnection();
        try {
            const fields = [];
            const params = [];
            if (name !== undefined) { fields.push('name = ?'); params.push(name); }
            if (branches !== undefined) { fields.push('branches = ?'); params.push(Number(branches) || 0); }
            if (imageUrl !== undefined) { fields.push('image_url = ?'); params.push(imageUrl); }
            if (locations !== undefined) { fields.push('locations = ?'); params.push(JSON.stringify(Array.isArray(locations) ? locations : [])); }
            if (description !== undefined) { fields.push('description = ?'); params.push(description || null); }
            if (whyChooseUs !== undefined) { fields.push('why_choose_us = ?'); params.push(JSON.stringify(Array.isArray(whyChooseUs) ? whyChooseUs : [])); }
            if (phone !== undefined) { fields.push('phone = ?'); params.push(phone || null); }
            if (hours !== undefined) { fields.push('hours = ?'); params.push(hours || null); }
            if (!fields.length) return { affectedRows: 0 };
            params.push(id);
            const [res] = await conn.query(`UPDATE restaurants SET ${fields.join(', ')} WHERE id = ?`, params);
            return { affectedRows: res.affectedRows };
        } finally {
            conn.release();
        }
    },

    remove: async (id) => {
        const conn = await pool.getConnection();
        try {
            const [res] = await conn.query('DELETE FROM restaurants WHERE id = ?', [id]);
            return { affectedRows: res.affectedRows };
        } finally {
            conn.release();
        }
    }
};

module.exports = Restaurant;
