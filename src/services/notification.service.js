import pool from '../config/db.js';
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export async function registerPushToken(userId, pushToken, platform) {
  if (!Expo.isExpoPushToken(pushToken)) {
    throw new Error('Push token inválido');
  }

  await pool.query(
    `
    INSERT INTO mdl_user_push_tokens (userid, push_token, platform)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      push_token = VALUES(push_token),
      platform = VALUES(platform)
    `,
    [userId, pushToken, platform || 'unknown']
  );

  return true;
}

export async function sendPushToUser(userId, title, body) {
  const [rows] = await pool.query(
    'SELECT push_token FROM mdl_user_push_tokens WHERE userid = ?',
    [userId]
  );

  if (!rows.length) {
    throw new Error('Usuario sin push token');
  }

  const message = {
    to: rows[0].push_token,
    sound: 'default',
    title,
    body,
  };

  await expo.sendPushNotificationsAsync([message]);
}