// src/services/PushService.js
// Servicio para gestionar suscripciones y envío de notificaciones push web
const webpush = require('web-push');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:admin@momentum.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

class PushService {
  static async sendNotification(subscription, payload) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = PushService;
