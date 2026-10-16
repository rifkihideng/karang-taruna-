import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import { getJwtSecret } from '../middleware/requireAdmin.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Hash dummy dengan biaya bcrypt yang sama (default 10 salt rounds) agar waktu
// respons login konsisten, sehingga keberadaan username tidak bisa dibedakan
// lewat timing attack (early return vs bcrypt.compare).
const DUMMY_HASH = bcrypt.hashSync(
  'dummy-password-for-timing-equalization',
  Number(process.env.ADMIN_SALT_ROUNDS || 10)
);

// Login admin: ambil user dari tabel admin_users dan verifikasi hash bcrypt.
// Mendukung optional PEPPER via ADMIN_PEPPER env var.
router.post('/login', loginLimiter, async (req, res) => {
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

    // Selalu jalankan bcrypt.compare (dengan hash dummy bila user tidak ada)
    // agar durasi respons sama untuk semua kasus kegagalan.
    const hash = user ? user.password_hash : DUMMY_HASH;
    const ok = await bcrypt.compare(password + PEPPER, hash);
    if (!user || !ok) {
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
