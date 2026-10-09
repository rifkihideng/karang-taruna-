import jwt from 'jsonwebtoken';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret === 'ganti-dengan-secret-acak-yang-aman') {
    return null;
  }
  return secret;
}

export function requireAdmin(req, res, next) {
  const secret = getJwtSecret();
  if (!secret) {
    return res.status(503).json({ error: 'Autentikasi admin belum dikonfigurasi' });
  }

  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Autentikasi admin diperlukan' });
  }

  try {
    const claims = jwt.verify(token, secret);
    if (!claims || typeof claims !== 'object' || typeof claims.username !== 'string') {
      return res.status(401).json({ error: 'Token admin tidak valid' });
    }
    req.admin = { username: claims.username };
    return next();
  } catch {
    return res.status(401).json({ error: 'Token admin tidak valid atau sudah kedaluwarsa' });
  }
}
