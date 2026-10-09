import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/kontak — simpan pesan dari form kontak
router.post('/', async (req, res, next) => {
  try {
    const { nama, email, pesan } = req.body || {};

    if (!nama || !String(nama).trim()) {
      return res.status(400).json({ error: 'Nama wajib diisi' });
    }
    if (!email || !EMAIL_RE.test(String(email))) {
      return res.status(400).json({ error: 'Email tidak valid' });
    }
    if (!pesan || !String(pesan).trim()) {
      return res.status(400).json({ error: 'Pesan wajib diisi' });
    }

    const result = await db.execute(
      'INSERT INTO kontak (nama, email, pesan) VALUES (?, ?, ?)',
      [String(nama).trim(), String(email).trim(), String(pesan).trim()]
    );

    res.status(201).json({
      data: {
        id: Number(result.lastInsertRowid),
        nama: String(nama).trim(),
        email: String(email).trim(),
        pesan: String(pesan).trim(),
      },
      message: 'Pesan berhasil dikirim. Terima kasih!',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
