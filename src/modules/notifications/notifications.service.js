import { Expo } from 'expo-server-sdk';
import prisma from '../../lib/prisma.js';
import { badRequest } from '../../lib/errors.js';

const expo = new Expo();

export async function registerPushToken(userId, pushToken, platform) {
  if (!Expo.isExpoPushToken(pushToken)) {
    throw badRequest('Push token inválido');
  }

  await prisma.userPushToken.upsert({
    where: { userId },
    update: { pushToken, platform },
    create: { userId, pushToken, platform },
  });
}

/**
 * Envía una notificación push a un usuario y devuelve true solo si Expo aceptó al menos un mensaje.
 */
export async function sendPushToUser(userId, { title, body, data = {} }) {
  const tokens = await prisma.userPushToken.findMany({ where: { userId } });
  if (!tokens.length) return false;

  const messages = tokens.map(t => ({
    to: t.pushToken,
    sound: 'default',
    channelId: 'default',
    title,
    body,
    data,
  }));

  let delivered = false;

  for (const chunk of expo.chunkPushNotifications(messages)) {
    const tickets = await expo.sendPushNotificationsAsync(chunk);

    for (const [i, ticket] of tickets.entries()) {
      if (ticket.status === 'ok') {
        delivered = true;
        continue;
      }

      console.error(
        `[push] Error enviando a usuario ${userId}: ${ticket.message}`,
        ticket.details ?? ''
      );

      if (ticket.details?.error === 'DeviceNotRegistered') {
        await prisma.userPushToken.deleteMany({
          where: { pushToken: chunk[i].to },
        });
      }
    }
  }

  return delivered;
}
