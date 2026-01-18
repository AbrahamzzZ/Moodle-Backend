import {
  registerPushToken,
  sendPushToUser
} from '../services/notification.service.js';

export async function registerToken(req, res) {
  try {
    const { pushToken, platform } = req.body;
    const userId = req.user.id;

    await registerPushToken(userId, pushToken, platform);

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function sendToUser(req, res) {
  try {
    const { userId, title, body } = req.body;

    await sendPushToUser(userId, title, body);

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}