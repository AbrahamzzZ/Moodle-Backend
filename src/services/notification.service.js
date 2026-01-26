import { Expo } from 'expo-server-sdk';
import prisma from '../prisma/client.js';

const expo = new Expo();

export async function registerPushToken(userId, pushToken, platform) {
  if (!Expo.isExpoPushToken(pushToken)) {
    throw new Error('Push token inválido');
  }

  await prisma.userPushToken.upsert({
    where: { userId },
    update: { pushToken, platform },
    create: { userId, pushToken, platform },
  });
}

export async function sendForumReminder(userId, title, body) {
  const tokens = await prisma.userPushToken.findMany({
    where: { userId },
  });

  if (!tokens.length) return;

  const messages = tokens.map(t => ({
    to: t.pushToken,
    sound: 'default',
    title,
    body,
  }));

  await expo.sendPushNotificationsAsync(messages);
}
