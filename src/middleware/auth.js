import { verifyAppToken } from '../lib/jwt.js';

export default function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, message: 'Token requerido' });
  }

  try {
    const decoded = verifyAppToken(header.slice('Bearer '.length));
    req.user = { id: decoded.id, email: decoded.email, fullname: decoded.fullname };
    next();
  } catch {
    return res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
  }
}
