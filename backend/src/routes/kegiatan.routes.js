import { Router } from 'express';
import { kegiatan } from '../data/seed.js';

const router = Router();

// GET /api/kegiatan
router.get('/', (req, res) => {
  res.json({ data: kegiatan });
});

// GET /api/kegiatan/:id
router.get('/:id', (req, res) => {
  const item = kegiatan.find((k) => k.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
  }
  res.json({ data: item });
});

export default router;
