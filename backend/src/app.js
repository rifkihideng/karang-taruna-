import express from 'express';
import cors from 'cors';

import beritaRoutes from './routes/berita.routes.js';
import kegiatanRoutes from './routes/kegiatan.routes.js';
import anggotaRoutes from './routes/anggota.routes.js';
import galeriRoutes from './routes/galeri.routes.js';
import statsRoutes from './routes/stats.routes.js';
import authRoutes from './routes/auth.routes.js';
import kontakRoutes from './routes/kontak.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API Karang Taruna berjalan normal',
    waktu: new Date().toISOString(),
  });
});

app.use('/api/berita', beritaRoutes);
app.use('/api/kegiatan', kegiatanRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/kontak', kontakRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Format JSON pada permintaan tidak valid' });
  }
  console.error(err);
  res.status(err.status || err.statusCode || 500).json({ error: 'Terjadi kesalahan pada server' });
});

export default app;
