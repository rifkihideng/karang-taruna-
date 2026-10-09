import rateLimit from 'express-rate-limit';

// Batasi seluruh API agar tidak mudah di-flood.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan, coba lagi nanti' },
});

// Batasi form publik (pendaftaran anggota & kontak) agar tidak di-spam.
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Terlalu banyak pengiriman, coba lagi beberapa menit lagi' },
});
