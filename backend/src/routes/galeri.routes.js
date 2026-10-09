import { Router } from 'express';
import { db } from '../db.js';
import { getPagination } from '../utils/pagination.js';

const router = Router();

// GET /api/galeri
router.get('/', async (req, res, next) => {
  try {
    const pagination = getPagination(req);
    const sql = pagination
      ? 'SELECT * FROM galeri ORDER BY id LIMIT ? OFFSET ?'
      : 'SELECT * FROM galeri ORDER BY id';
    const args = pagination ? [pagination.limit, pagination.offset] : [];
    const { rows } = await db.execute(sql, args);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

export default router;
