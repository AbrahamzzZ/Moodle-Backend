import { requireFields } from '../../lib/validate.js';
import { registerPushToken } from './notifications.service.js';

/** POST /api/notifications/register  { pushToken, platform } */
export async function registerToken(req, res) {
  requireFields(req.body, ['pushToken']);
  await registerPushToken(req.user.id, req.body.pushToken, req.body.platform ?? 'unknown');
  res.json({ ok: true });
}
