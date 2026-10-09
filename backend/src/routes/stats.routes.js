import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/stats — jumlah data untuk ditampilkan di beranda
router.get('/', async (req, res, next) => {
  try {
    const tables = ['anggota', 'kegiatan', 'berita', 'galeri'];
    const counts = await Promise.all(
      tables.map(async (table) => {
        const { rows } = await db.execute(`SELECT COUNT(*) AS c FROM ${table}`);
        return Number(rows[0].c);
      })
    );

    const [anggota, kegiatan, berita, galeri] = counts;
    res.json({ data: { anggota, kegiatan, berita, galeri } });
  } catch (err) {
    next(err);
  }
});

export default router;
