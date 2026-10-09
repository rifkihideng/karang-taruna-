import { Router } from 'express';

const router = Router();

// TODO: implementasi login admin dengan JWT + bcrypt pada tahap berikutnya.
// Contoh alur: POST /api/auth/login -> verifikasi email/password -> terbitkan token JWT.
router.post('/login', (req, res) => {
  res.status(501).json({
    message:
      'Login admin belum diimplementasikan. Akan ditambahkan pada tahap berikutnya (JWT + bcrypt).',
  });
});

export default router;
