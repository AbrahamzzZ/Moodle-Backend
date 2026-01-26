import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: 'Token requerido',
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      moodleToken: decoded.moodleToken,
    };

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      message: 'Token inválido o expirado',
    });
  }
}