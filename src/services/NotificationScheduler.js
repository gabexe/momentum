// src/services/NotificationScheduler.js
// Programador y cola para notificaciones push
const Task = require('../models/Task');
const Subscription = require('../models/Subscription');
const PushService = require('./PushService');
const Templates = require('./NotificationTemplates');

class NotificationScheduler {
  // Programa notificaciones para tareas próximas
  static async scheduleReminders() {
    const now = new Date();
    const soon = new Date(now.getTime() + 15 * 60 * 1000); // 15 min
    const tasks = await Task.find({ dueDate: { $gte: now, $lte: soon }, status: 'pending' });
    for (const task of tasks) {
      const subs = await Subscription.find({ userId: task.userId });
      for (const sub of subs) {
        await PushService.sendNotification(sub, Templates.reminder(task.title));
      }
    }
  }
}

if (require.main === module) {
  require('../../src/index'); // Inicializa conexión y modelos
  NotificationScheduler.scheduleReminders().then(() => {
    console.log('Notificaciones programadas enviadas');
    process.exit(0);
  }).catch(err => {
    console.error('Error al enviar notificaciones:', err);
    process.exit(1);
  });
}

module.exports = NotificationScheduler;
