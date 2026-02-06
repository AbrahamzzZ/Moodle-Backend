import jwt from 'jsonwebtoken';
import {
  validateGoogleToken,
  getMoodleUserByEmail,
  getUserRoleByCourse,
} from '../services/auth.service.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

export async function loginWithGoogle(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: 'Token requerido',
      });
    }

    const idToken = authHeader.replace('Bearer ', '');
    const googleUser = await validateGoogleToken(idToken);
    const moodleUser = await getMoodleUserByEmail(googleUser.email);

    if (!moodleUser) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no existe en Moodle',
      });
    }

    const appToken = jwt.sign(
      {
        id: moodleUser.id,
        fullname: `${moodleUser.firstname} ${moodleUser.lastname}`,
        email: moodleUser.email,
        address: moodleUser.address,
        city: moodleUser.city,
        phone:moodleUser.phone1,
        country: moodleUser.country,
        description: moodleUser.description,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      ok: true,
      token: appToken,
      user: {
        id: moodleUser.id,
        fullname: `${moodleUser.firstname} ${moodleUser.lastname}`,
        email: moodleUser.email,
        address: moodleUser.address ?? null,
        city: moodleUser.city ?? null,
        phone: moodleUser.phone1 ?? null,
        country: moodleUser.country ?? null,
        description: moodleUser.description ?? null,

      },
    });
  } catch (error) {
    console.error('loginWithGoogle error:', error.message);
    return res.status(401).json({
      ok: false,
      message: 'Token inválido o expirado',
    });
  }
}

export async function getRoleByCourse(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const role = await getUserRoleByCourse({ userId, courseId });

    if (!role) {
      return res.status(403).json({
        ok: false,
        message: 'Usuario no matriculado en el curso',
      });
    }

    return res.json({
      ok: true,
      role,
    });
  } catch (error) {
    console.error('getRoleByCourse error:', error.message);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo rol',
    });
  }
}

/*const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;
const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_API_TOKEN = process.env.MOODLE_API_TOKEN;

export async function loginWithGoogle(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ ok: false, message: 'Token requerido' });
    }

    const idToken = authHeader.replace('Bearer ', '');
    const { data: googleUser } = await axios.get(
      'https://oauth2.googleapis.com/tokeninfo',
      { params: { id_token: idToken } }
    );

    const response = await axios.get(MOODLE_URL, {
      params: {
        wstoken: MOODLE_API_TOKEN,
        wsfunction: 'core_user_get_users_by_field',
        moodlewsrestformat: 'json',
        field: 'email',
        'values[0]': googleUser.email,
      },
    });

    if (!response.data || response.data.length === 0) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no existe en Moodle',
      });
    }

    const moodleUser = response.data[0];

    const appToken = jwt.sign(
      {
        id: moodleUser.id,
        fullname: `${moodleUser.firstname} ${moodleUser.lastname}`,
        email: moodleUser.email,
        address: moodleUser.address,
        city: moodleUser.city,
        phone:moodleUser.phone1,
        country: moodleUser.country,
        description: moodleUser.description,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      ok: true,
      token: appToken,
      user: {
        id: moodleUser.id,
        fullname: `${moodleUser.firstname} ${moodleUser.lastname}`,
        email: moodleUser.email,
        address: moodleUser.address ?? null,
        city: moodleUser.city ?? null,
        phone: moodleUser.phone1 ?? null,
        country: moodleUser.country ?? null,
        description: moodleUser.description ?? null,
      }
    });
  } catch (error) {
    console.error('Auth error:', error.response?.data || error.message);
    return res.status(401).json({
      ok: false,
      message: 'Token inválido o expirado',
    });
  }
}*/
