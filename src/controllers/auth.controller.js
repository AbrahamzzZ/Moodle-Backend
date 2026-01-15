import axios from "axios";

const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

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

    const email = googleUser.email;
    const response = await axios.get(MOODLE_URL, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: 'core_user_get_users_by_field',
        moodlewsrestformat: 'json',
        field: 'email',
        'values[0]': email,
      },
    });

    if (!response.data || response.data.length === 0) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no existe en Moodle',
      });
    }

    const moodleUser = response.data[0];

    return res.json({
      ok: true,
      user: {
        id: moodleUser.id,
        fullname: `${moodleUser.firstname} ${moodleUser.lastname}`,
        email: moodleUser.email,
      },
    });

  } catch (error) {
    console.error('Auth error:', error.response?.data || error.message);

    return res.status(401).json({
      ok: false,
      message: 'Token inválido o expirado',
    });
  }
}