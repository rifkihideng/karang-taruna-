import express from 'express';
import cors from 'cors';

import beritaRoutes from './routes/berita.routes.js';
import kegiatanRoutes from './routes/kegiatan.routes.js';
import anggotaRoutes from './routes/anggota.routes.js';
import galeriRoutes from './routes/galeri.routes.js';
import statsRoutes from './routes/stats.routes.js';
import authRoutes from './routes/auth.routes.js';

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

export default app;
