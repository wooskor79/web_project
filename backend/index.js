const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'dashboard',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(conn => {
        console.log("DB Connected Successfully");
        conn.release();
    })
    .catch(err => {
        console.error("DB Connection Failed:", err);
    });

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_admin_dashboard_change_it';

// --- Auth API ---

app.get('/api/setup/status', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM admin_users');
        res.json({ isSetup: rows[0].count > 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/setup', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });

        const [rows] = await pool.query('SELECT COUNT(*) as count FROM admin_users');
        if (rows[0].count > 0) {
            return res.status(403).json({ error: 'Admin user already setup.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Theme & Blocks API ---

app.get('/api/theme', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM global_theme WHERE id = 1');
        res.json(rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/theme', async (req, res) => {
    try {
        const { theme_type, preset_name, custom_primary_bg, custom_surface_color, custom_text_color } = req.body;
        await pool.query(
            `UPDATE global_theme SET 
             theme_type = ?, preset_name = ?, custom_primary_bg = ?, custom_surface_color = ?, custom_text_color = ? 
             WHERE id = 1`,
            [theme_type, preset_name, custom_primary_bg, custom_surface_color, custom_text_color]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/blocks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM page_blocks');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/blocks', async (req, res) => {
    try {
        const { id, block_type, content_data, layout_i, layout_x, layout_y, layout_w, layout_h } = req.body;
        await pool.query(
            `INSERT INTO page_blocks (id, block_type, content_data, layout_i, layout_x, layout_y, layout_w, layout_h)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, block_type, JSON.stringify(content_data), layout_i, layout_x, layout_y, layout_w, layout_h]
        );
        res.json({ success: true, id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/blocks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content_data, layout_x, layout_y, layout_w, layout_h } = req.body;
        await pool.query(
            `UPDATE page_blocks SET 
             content_data = COALESCE(?, content_data), 
             layout_x = COALESCE(?, layout_x), 
             layout_y = COALESCE(?, layout_y), 
             layout_w = COALESCE(?, layout_w), 
             layout_h = COALESCE(?, layout_h)
             WHERE id = ?`,
            [
                content_data ? JSON.stringify(content_data) : null,
                layout_x !== undefined ? layout_x : null,
                layout_y !== undefined ? layout_y : null,
                layout_w !== undefined ? layout_w : null,
                layout_h !== undefined ? layout_h : null,
                id
            ]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("PUT Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/blocks-batch', async (req, res) => {
    try {
        const { blocks } = req.body;
        for (const block of blocks) {
            await pool.query(
                `UPDATE page_blocks SET layout_x=?, layout_y=?, layout_w=?, layout_h=? WHERE id=?`,
                [block.layout_x, block.layout_y, block.layout_w, block.layout_h, block.id]
            );
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/blocks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM page_blocks WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
