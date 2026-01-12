import axios from "axios";

const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

export async function loginWithGoogle(req, res) {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({
      ok: false,
      message: "Email requerido",
    });
  }

  try {
    const response = await axios.get(MOODLE_URL, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: "core_user_get_users_by_field",
        moodlewsrestformat: "json",
        field: "email",
        "values[0]": email,
      },
    });

    const users = response.data;

    if (!users || users.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "El usuario no existe en Moodle",
      });
    }

    const moodleUser = users[0];

    return res.json({
      ok: true,
      user: {
        id: moodleUser.id,
        fullname: `${moodleUser.firstname} ${moodleUser.lastname}`,
        email: moodleUser.email,
        role: moodleUser.role || "estudiante",
      },
    });

  } catch (error) {
    console.error("Error Moodle Auth:", error.message);

    res.status(500).json({
      ok: false,
      message: "Error al validar usuario en Moodle",
    });
  }
}
