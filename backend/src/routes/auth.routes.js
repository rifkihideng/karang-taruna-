import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import { getJwtSecret } from '../middleware/requireAdmin.js';

const router = Router();

// Login admin: ambil user dari tabel admin_users dan verifikasi hash bcrypt.
// Mendukung optional PEPPER via ADMIN_PEPPER env var.
router.post('/login', async (req, res) => {
  try {
    const { username = 'admin', password } = req.body || {};
    const jwtSecret = getJwtSecret();
    const PEPPER = process.env.ADMIN_PEPPER || '';

    if (!jwtSecret) {
      return res.status(503).json({ error: 'Autentikasi admin belum dikonfigurasi' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password dibutuhkan' });
    }
    if (typeof username !== 'string' || username.length > 100) {
      return res.status(400).json({ error: 'Username tidak valid' });
    }

    const { rows } = await db.execute('SELECT * FROM admin_users WHERE username = ? LIMIT 1', [username]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Kredensial salah' });
    }

    const ok = await bcrypt.compare(password + PEPPER, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Kredensial salah' });
    }

    const payload = { username: user.username };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '8h' });

    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Gagal proses login' });
  }
});

export default router;
