import { Router } from 'express';
import { berita, kegiatan, anggota, galeri } from '../data/seed.js';

const router = Router();

// GET /api/stats — jumlah data untuk ditampilkan di beranda
router.get('/', (req, res) => {
  res.json({
    data: {
      anggota: anggota.length,
      kegiatan: kegiatan.length,
      berita: berita.length,
      galeri: galeri.length,
    },
  });
});

export default router;
