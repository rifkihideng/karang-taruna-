import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/stats — jumlah data untuk ditampilkan di beranda
router.get('/', async (req, res, next) => {
  try {
    // Anggota dihitung hanya yang aktif (belum dihapus soft-delete).
    const counts = await Promise.all([
      db.execute(`SELECT COUNT(*) AS c FROM anggota WHERE deleted_at IS NULL`),
      db.execute(`SELECT COUNT(*) AS c FROM kegiatan`),
      db.execute(`SELECT COUNT(*) AS c FROM berita`),
      db.execute(`SELECT COUNT(*) AS c FROM galeri`),
    ]);

    const [anggota, kegiatan, berita, galeri] = counts.map(
      ({ rows }) => Number(rows[0].c)
    );
    res.json({ data: { anggota, kegiatan, berita, galeri } });
  } catch (err) {
    next(err);
  }
});

export default router;
