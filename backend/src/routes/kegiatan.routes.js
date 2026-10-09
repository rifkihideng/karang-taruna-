import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../db.js';
import { getPagination } from '../utils/pagination.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

const validateKegiatan = [
  body('nama')
    .isString()
    .withMessage('Nama kegiatan harus berupa teks')
    .trim()
    .notEmpty()
    .withMessage('Nama kegiatan wajib diisi')
    .isLength({ max: 150 })
    .withMessage('Nama kegiatan maksimal 150 karakter'),
  body('tanggal')
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Tanggal harus berformat YYYY-MM-DD')
    .custom((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    .withMessage('Tanggal harus berformat YYYY-MM-DD'),
  body('waktu')
    .optional({ values: 'falsy' })
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('Waktu harus berformat HH:MM'),
  body('tempat')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Tempat harus berupa teks')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tempat maksimal 200 karakter'),
  body('status')
    .optional()
    .isIn(['terjadwal', 'selesai'])
    .withMessage('Status kegiatan tidak valid'),
];

function validId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: 'ID kegiatan tidak valid' });
    return null;
  }
  return id;
}

function validationError(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ error: errors.array()[0].msg });
  return true;
}

// GET /api/kegiatan
router.get('/', async (req, res, next) => {
  try {
    const pagination = getPagination(req);
    const sql = pagination
      ? 'SELECT * FROM kegiatan ORDER BY tanggal DESC LIMIT ? OFFSET ?'
      : 'SELECT * FROM kegiatan ORDER BY tanggal DESC';
    const args = pagination ? [pagination.limit, pagination.offset] : [];
    const { rows } = await db.execute(sql, args);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// CRUD agenda hanya dapat digunakan oleh admin.
router.post('/', requireAdmin, validateKegiatan, async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    const { nama, tanggal, waktu = '', tempat = '', status = 'terjadwal' } = req.body;
    const result = await db.execute(
      'INSERT INTO kegiatan (nama, tanggal, waktu, tempat, status) VALUES (?, ?, ?, ?, ?)',
      [nama.trim(), tanggal, waktu, tempat.trim(), status]
    );
    const { rows } = await db.execute('SELECT * FROM kegiatan WHERE id = ?', [Number(result.lastInsertRowid)]);
    res.status(201).json({ data: rows[0], message: 'Agenda berhasil ditambahkan' });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAdmin, validateKegiatan, async (req, res, next) => {
  try {
    const id = validId(req, res);
    if (id === null || validationError(req, res)) return;
    const { nama, tanggal, waktu = '', tempat = '', status = 'terjadwal' } = req.body;
    const result = await db.execute(
      'UPDATE kegiatan SET nama = ?, tanggal = ?, waktu = ?, tempat = ?, status = ? WHERE id = ?',
      [nama.trim(), tanggal, waktu, tempat.trim(), status, id]
    );
    if (Number(result.rowsAffected) === 0) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    }
    const { rows } = await db.execute('SELECT * FROM kegiatan WHERE id = ?', [id]);
    res.json({ data: rows[0], message: 'Agenda berhasil diperbarui' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = validId(req, res);
    if (id === null) return;
    const result = await db.execute('DELETE FROM kegiatan WHERE id = ?', [id]);
    if (Number(result.rowsAffected) === 0) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    }
    res.json({ message: 'Agenda berhasil dihapus' });
  } catch (err) {
    next(err);
  }
});

// GET /api/kegiatan/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = validId(req, res);
    if (id === null) return;

    const { rows } = await db.execute('SELECT * FROM kegiatan WHERE id = ?', [id]);
    const item = rows[0];
    if (!item) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    }
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
});

export default router;
