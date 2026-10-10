import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import { put } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '../db.js';
import { getPagination } from '../utils/pagination.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new Error('Gambar harus berformat JPG, PNG, WEBP, GIF, atau AVIF'));
    }
    cb(null, true);
  },
});

function uploadGambar(req, res, next) {
  upload.single('gambar')(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Ukuran gambar maksimal 5 MB'
        : err.message || 'Gagal mengunggah gambar';
    res.status(400).json({ error: message });
  });
}

// Simpan file gambar. Di Vercel/produksi unggah ke Vercel Blob (filesystem
// serverless tidak bisa dipakai), sedangkan di development simpan ke folder lokal.
async function simpanGambar(file) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const cleanName = file.originalname.replace(/[^\w.\-]+/g, '-');
    const blob = await put(`berita/${Date.now().toString(36)}-${cleanName}`, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
    });
    return blob.url;
  }

  fs.mkdirSync(uploadDir, { recursive: true });
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const unique = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `berita-${unique}${ext}`;
  fs.writeFileSync(path.join(uploadDir, filename), file.buffer);
  return `/uploads/${filename}`;
}

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
router.post('/', requireAdmin, uploadGambar, validateBerita, async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    const { judul, kategori, tanggal, ringkasan, isi } = req.body;
    const gambar = req.file ? await simpanGambar(req.file) : null;
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

// PUT /api/berita/:id — perbarui berita (admin only)
router.put('/:id', requireAdmin, uploadGambar, validateBerita, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'ID berita tidak valid' });
    }
    if (validationError(req, res)) return;

    const { judul, kategori, tanggal, ringkasan, isi } = req.body;
    let gambar = req.body.gambarExisting || null;
    if (req.file) {
      gambar = await simpanGambar(req.file);
    }

    const result = await db.execute(
      'UPDATE berita SET judul = ?, kategori = ?, tanggal = ?, ringkasan = ?, isi = ?, gambar = ? WHERE id = ?',
      [judul.trim(), kategori.trim(), tanggal, ringkasan.trim(), isi.trim(), gambar, id]
    );
    if (Number(result.rowsAffected) === 0) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }
    const { rows } = await db.execute('SELECT * FROM berita WHERE id = ?', [id]);
    res.json({ data: rows[0], message: 'Berita berhasil diperbarui' });
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
