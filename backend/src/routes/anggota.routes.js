import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../db.js';
import { formLimiter } from '../middleware/rateLimit.js';
import { getPagination } from '../utils/pagination.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// Data pendaftar (termasuk kontak dan alamat) hanya untuk admin.
router.get('/admin/pendaftar', requireAdmin, async (req, res, next) => {
  try {
    const { rows } = await db.execute(
      `SELECT id, nama, alamat, kontak, minat, status, created_at
       FROM anggota
       WHERE created_at IS NOT NULL AND deleted_at IS NULL
       ORDER BY created_at DESC, id DESC`
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// Rekap anggota: jumlah & daftar anggota lama (seed) vs baru (mendaftar).
router.get('/admin/rekap', requireAdmin, async (req, res, next) => {
  try {
    const { rows } = await db.execute(
      `SELECT id, nama, jabatan, angkatan, alamat, kontak, minat, status, created_at
       FROM anggota
       WHERE deleted_at IS NULL
       ORDER BY (created_at IS NULL) DESC, id DESC`
    );
    const anggota = rows.map((row) => ({
      ...row,
      tipe: row.created_at ? 'baru' : 'lama',
    }));
    const lama = anggota.filter((a) => a.tipe === 'lama').length;
    const baru = anggota.length - lama;
    res.json({ data: { total: anggota.length, lama, baru, anggota } });
  } catch (err) {
    next(err);
  }
});

// Statistik pendaftaran anggota baru (admin only).
router.get('/admin/statistik', requireAdmin, async (req, res, next) => {
  try {
    const { rows: totalRows } = await db.execute(
      `SELECT COUNT(*) AS c FROM anggota WHERE created_at IS NOT NULL AND deleted_at IS NULL`
    );
    const total = Number(totalRows[0].c);

    const { rows: perBulanRows } = await db.execute(
      `SELECT substr(created_at, 1, 7) AS bulan, COUNT(*) AS jumlah
       FROM anggota
       WHERE created_at IS NOT NULL AND deleted_at IS NULL
       GROUP BY substr(created_at, 1, 7)
       ORDER BY bulan`
    );
    const { rows: perStatusRows } = await db.execute(
      `SELECT COALESCE(status, 'pending') AS status, COUNT(*) AS jumlah
       FROM anggota
       WHERE created_at IS NOT NULL AND deleted_at IS NULL
       GROUP BY status
       ORDER BY jumlah DESC`
    );
    const { rows: perAngkatanRows } = await db.execute(
      `SELECT COALESCE(angkatan, '-') AS angkatan, COUNT(*) AS jumlah
       FROM anggota
       WHERE created_at IS NOT NULL AND deleted_at IS NULL
       GROUP BY angkatan
       ORDER BY jumlah DESC`
    );
    const { rows: perMinatRows } = await db.execute(
      `SELECT minat, COUNT(*) AS jumlah
       FROM anggota
       WHERE created_at IS NOT NULL AND deleted_at IS NULL AND minat IS NOT NULL AND minat != ''
       GROUP BY minat
       ORDER BY jumlah DESC`
    );

    // Isi 12 bulan terakhir agar bulan tanpa pendaftar tetap tampil.
    const now = new Date();
    const bulanList = [];
    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      bulanList.push(key);
    }
    const perBulan = bulanList.map((bulan) => {
      const found = perBulanRows.find((row) => row.bulan === bulan);
      return { bulan, jumlah: found ? Number(found.jumlah) : 0 };
    });
    const bulanIni = perBulan[perBulan.length - 1].jumlah;

    res.json({
      data: {
        total,
        bulanIni,
        perBulan,
        perStatus: perStatusRows.map((row) => ({
          status: row.status,
          jumlah: Number(row.jumlah),
        })),
        perAngkatan: perAngkatanRows.map((row) => ({
          angkatan: row.angkatan,
          jumlah: Number(row.jumlah),
        })),
        perMinat: perMinatRows.map((row) => ({
          minat: row.minat,
          jumlah: Number(row.jumlah),
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

const validateAnggota = [
  body('nama')
    .isString()
    .withMessage('Nama harus berupa teks')
    .trim()
    .notEmpty()
    .withMessage('Nama wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Nama maksimal 100 karakter'),
  body('alamat')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Alamat harus berupa teks')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Alamat maksimal 200 karakter'),
  body('kontak')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Kontak harus berupa teks')
    .trim()
    .isLength({ max: 30 })
    .withMessage('Kontak maksimal 30 karakter'),
  body('minat')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Minat harus berupa teks')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Minat maksimal 100 karakter'),
];

// GET /api/anggota
router.get('/', async (req, res, next) => {
  try {
    const pagination = getPagination(req);
    const sql = pagination
      ? 'SELECT id, nama, jabatan, angkatan FROM anggota WHERE deleted_at IS NULL ORDER BY id LIMIT ? OFFSET ?'
      : 'SELECT id, nama, jabatan, angkatan FROM anggota WHERE deleted_at IS NULL ORDER BY id';
    const args = pagination ? [pagination.limit, pagination.offset] : [];
    const { rows } = await db.execute(sql, args);
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

    const { rows } = await db.execute(
      'SELECT id, nama, jabatan, angkatan FROM anggota WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
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
router.post('/', formLimiter, validateAnggota, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { nama, alamat, kontak, minat } = req.body;

    const result = await db.execute(
      `INSERT INTO anggota (nama, alamat, kontak, minat, jabatan, angkatan, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        nama.trim(),
        (alamat || '').trim(),
        (kontak || '').trim(),
        (minat || '').trim(),
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

// DELETE /api/anggota/:id — hapus anggota (admin only, soft delete).
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'ID anggota tidak valid' });
    }
    const result = await db.execute(
      `UPDATE anggota SET deleted_at = datetime('now') WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    if (Number(result.rowsAffected) === 0) {
      return res.status(404).json({ error: 'Anggota tidak ditemukan' });
    }
    res.json({ message: 'Anggota berhasil dihapus' });
  } catch (err) {
    next(err);
  }
});

export default router;
