import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../db.js';
import { getPagination } from '../utils/pagination.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

const validateBerita = [
  body('judul')
    .isString()
    .withMessage('Judul berita harus berupa teks')
    .trim()
    .notEmpty()
    .withMessage('Judul berita wajib diisi')
    .isLength({ max: 200 })
    .withMessage('Judul berita maksimal 200 karakter'),
  body('kategori')
    .isString()
    .withMessage('Kategori berita harus berupa teks')
    .trim()
    .notEmpty()
    .withMessage('Kategori berita wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Kategori berita maksimal 100 karakter'),
  body('tanggal')
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Tanggal harus berformat YYYY-MM-DD')
    .custom((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    .withMessage('Tanggal harus berformat YYYY-MM-DD'),
  body('ringkasan')
    .isString()
    .withMessage('Ringkasan harus berupa teks')
    .trim()
    .notEmpty()
    .withMessage('Ringkasan wajib diisi')
    .isLength({ max: 500 })
    .withMessage('Ringkasan maksimal 500 karakter'),
  body('isi')
    .isString()
    .withMessage('Isi berita harus berupa teks')
    .trim()
    .notEmpty()
    .withMessage('Isi berita wajib diisi'),
  body('gambar')
    .optional({ values: 'falsy' })
    .isURL()
    .withMessage('Gambar harus berupa URL yang valid'),
];

function validationError(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ error: errors.array()[0].msg });
  return true;
}

// GET /api/berita
router.get('/', async (req, res, next) => {
  try {
    const pagination = getPagination(req);
    const sql = pagination
      ? 'SELECT * FROM berita ORDER BY tanggal DESC LIMIT ? OFFSET ?'
      : 'SELECT * FROM berita ORDER BY tanggal DESC';
    const args = pagination ? [pagination.limit, pagination.offset] : [];
    const { rows } = await db.execute(sql, args);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/berita — tambah berita (admin only)
router.post('/', requireAdmin, validateBerita, async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    const { judul, kategori, tanggal, ringkasan, isi } = req.body;
    const gambar = typeof req.body.gambar === 'string' && req.body.gambar.trim()
      ? req.body.gambar.trim()
      : null;
    const result = await db.execute(
      'INSERT INTO berita (judul, kategori, tanggal, ringkasan, isi, gambar) VALUES (?, ?, ?, ?, ?, ?)',
      [judul.trim(), kategori.trim(), tanggal, ringkasan.trim(), isi.trim(), gambar]
    );
    const { rows } = await db.execute('SELECT * FROM berita WHERE id = ?', [Number(result.lastInsertRowid)]);
    res.status(201).json({ data: rows[0], message: 'Berita berhasil ditambahkan' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/berita/:id — hapus berita (admin only)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'ID berita tidak valid' });
    }
    const result = await db.execute('DELETE FROM berita WHERE id = ?', [id]);
    if (Number(result.rowsAffected) === 0) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (err) {
    next(err);
  }
});

// GET /api/berita/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'ID berita tidak valid' });
    }

    const { rows } = await db.execute('SELECT * FROM berita WHERE id = ?', [id]);
    const item = rows[0];
    if (!item) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
});

export default router;
