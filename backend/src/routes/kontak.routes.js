import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../db.js';
import { formLimiter } from '../middleware/rateLimit.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

const validateKontak = [
  body('nama')
    .isString()
    .withMessage('Nama harus berupa teks')
    .trim()
    .notEmpty()
    .withMessage('Nama wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Nama maksimal 100 karakter'),
  body('email')
    .isString()
    .withMessage('Email harus berupa teks')
    .trim()
    .isEmail()
    .withMessage('Email tidak valid')
    .isLength({ max: 100 })
    .withMessage('Email maksimal 100 karakter'),
  body('pesan')
    .isString()
    .withMessage('Pesan harus berupa teks')
    .trim()
    .notEmpty()
    .withMessage('Pesan wajib diisi')
    .isLength({ max: 2000 })
    .withMessage('Pesan maksimal 2000 karakter'),
];

// GET /api/kontak — daftar pesan masuk (admin only)
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { rows } = await db.execute(
      'SELECT id, nama, email, pesan, created_at FROM kontak ORDER BY created_at DESC, id DESC'
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/kontak/:id — hapus pesan masuk (admin only)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'ID pesan tidak valid' });
    }
    const result = await db.execute('DELETE FROM kontak WHERE id = ?', [id]);
    if (Number(result.rowsAffected) === 0) {
      return res.status(404).json({ error: 'Pesan tidak ditemukan' });
    }
    res.json({ message: 'Pesan berhasil dihapus' });
  } catch (err) {
    next(err);
  }
});

// POST /api/kontak — simpan pesan dari form kontak
router.post('/', formLimiter, validateKontak, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { nama, email, pesan } = req.body;

    const result = await db.execute(
      'INSERT INTO kontak (nama, email, pesan) VALUES (?, ?, ?)',
      [nama.trim(), email.trim(), pesan.trim()]
    );

    res.status(201).json({
      data: {
        id: Number(result.lastInsertRowid),
        nama: nama.trim(),
        email: email.trim(),
        pesan: pesan.trim(),
      },
      message: 'Pesan berhasil dikirim. Terima kasih!',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
