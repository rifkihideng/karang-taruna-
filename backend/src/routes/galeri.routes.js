import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/galeri
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.execute('SELECT * FROM galeri ORDER BY id');
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

export default router;
