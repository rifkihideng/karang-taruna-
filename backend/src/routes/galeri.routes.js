import { Router } from 'express';
import { galeri } from '../data/seed.js';

const router = Router();

// GET /api/galeri
router.get('/', (req, res) => {
  res.json({ data: galeri });
});

export default router;
