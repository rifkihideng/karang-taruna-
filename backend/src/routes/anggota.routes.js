import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// GET /api/anggota
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.execute('SELECT * FROM anggota ORDER BY id');
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/anggota/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'ID anggota tidak valid' });
    }

    const { rows } = await db.execute('SELECT * FROM anggota WHERE id = ?', [id]);
    const item = rows[0];
    if (!item) {
      return res.status(404).json({ error: 'Anggota tidak ditemukan' });
    }
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
});

// POST /api/anggota — pendaftaran anggota baru
router.post('/', async (req, res, next) => {
  try {
    const { nama, alamat, kontak, minat } = req.body || {};
    if (!nama || !String(nama).trim()) {
      return res.status(400).json({ error: 'Nama wajib diisi' });
    }

    const result = await db.execute(
      `INSERT INTO anggota (nama, alamat, kontak, minat, jabatan, angkatan, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        String(nama).trim(),
        alamat || '',
        kontak || '',
        minat || '',
        'Anggota',
        String(new Date().getFullYear()),
        'pending',
      ]
    );

    const id = Number(result.lastInsertRowid);
    const { rows } = await db.execute('SELECT * FROM anggota WHERE id = ?', [id]);

    res.status(201).json({ data: rows[0], message: 'Pendaftaran berhasil diterima' });
  } catch (err) {
    next(err);
  }
});

export default router;
