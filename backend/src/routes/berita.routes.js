import { Router } from 'express';
import { berita } from '../data/seed.js';

const router = Router();

// GET /api/berita
router.get('/', (req, res) => {
  res.json({ data: berita });
});

// GET /api/berita/:id
router.get('/:id', (req, res) => {
  const item = berita.find((b) => b.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Berita tidak ditemukan' });
  }
  res.json({ data: item });
});

export default router;
