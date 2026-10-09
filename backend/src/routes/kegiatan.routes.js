import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/kegiatan
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.execute('SELECT * FROM kegiatan ORDER BY tanggal DESC');
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/kegiatan/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'ID kegiatan tidak valid' });
    }

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
