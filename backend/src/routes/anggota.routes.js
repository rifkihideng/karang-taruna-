import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../db.js';
import { formLimiter } from '../middleware/rateLimit.js';

const router = Router();

const validateAnggota = [
  body('nama')
    .isString()
    .withMessage('Nama harus berupa teks')
    .trim()
    .notEmpty()
    .withMessage('Nama wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Nama maksimal 100 karakter'),
  body('alamat')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Alamat harus berupa teks')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Alamat maksimal 200 karakter'),
  body('kontak')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Kontak harus berupa teks')
    .trim()
    .isLength({ max: 30 })
    .withMessage('Kontak maksimal 30 karakter'),
  body('minat')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Minat harus berupa teks')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Minat maksimal 100 karakter'),
];

// GET /api/anggota
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.execute('SELECT * FROM anggota ORDER BY id');
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/anggota/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'ID anggota tidak valid' });
    }

    const { rows } = await db.execute('SELECT * FROM anggota WHERE id = ?', [id]);
    const item = rows[0];
    if (!item) {
      return res.status(404).json({ error: 'Anggota tidak ditemukan' });
    }
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
});

// POST /api/anggota — pendaftaran anggota baru
router.post('/', formLimiter, validateAnggota, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { nama, alamat, kontak, minat } = req.body;

    const result = await db.execute(
      `INSERT INTO anggota (nama, alamat, kontak, minat, jabatan, angkatan, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nama.trim(),
        (alamat || '').trim(),
        (kontak || '').trim(),
        (minat || '').trim(),
        'Anggota',
        String(new Date().getFullYear()),
        'pending',
      ]
    );

    const id = Number(result.lastInsertRowid);
    const { rows } = await db.execute('SELECT * FROM anggota WHERE id = ?', [id]);

    res.status(201).json({ data: rows[0], message: 'Pendaftaran berhasil diterima' });
  } catch (err) {
    next(err);
  }
});

export default router;
