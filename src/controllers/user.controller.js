import * as userService from '../services/user.service.js';

export async function createUser(req, res) {
  try {
    const { nombre, email, rol } = req.body;

    let user = await userService.findByEmail(email);
    
    if (!user) {
      user = await userService.createUser({
        nombre,
        email,
        rol,
        tokenOAuth: '',
        tokenMoodle: '',
        activo: true
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando usuario' });
  }
}
