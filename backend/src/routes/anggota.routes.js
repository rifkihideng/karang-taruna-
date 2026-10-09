import { Router } from 'express';
import { anggota } from '../data/seed.js';

const router = Router();

// GET /api/anggota
router.get('/', (req, res) => {
  res.json({ data: anggota });
});

// GET /api/anggota/:id
router.get('/:id', (req, res) => {
  const item = anggota.find((a) => a.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Anggota tidak ditemukan' });
  }
  res.json({ data: item });
});

// POST /api/anggota — pendaftaran anggota baru (sementara disimpan di memori)
router.post('/', (req, res) => {
  const { nama, alamat, kontak, minat } = req.body || {};
  if (!nama) {
    return res.status(400).json({ error: 'Nama wajib diisi' });
  }

  const item = {
    id: anggota.length ? Math.max(...anggota.map((a) => a.id)) + 1 : 1,
    nama,
    alamat: alamat || '',
    kontak: kontak || '',
    minat: minat || '',
    jabatan: 'Anggota',
    angkatan: String(new Date().getFullYear()),
    status: 'pending',
  };
  anggota.push(item);

  res.status(201).json({ data: item, message: 'Pendaftaran berhasil diterima' });
});

export default router;
