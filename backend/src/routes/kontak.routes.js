import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../db.js';
import { formLimiter } from '../middleware/rateLimit.js';

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
