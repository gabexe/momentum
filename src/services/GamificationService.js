// src/services/GamificationService.js
const Gamification = require('../models/Gamification');
const Task = require('../models/Task');

class GamificationService {
  // Lógica: suma puntos y racha si el usuario completa una tarea
  static async onTaskCompleted(userId) {
    if (!userId) return;
    let gam = await Gamification.findOne({ userId });
    if (!gam) gam = new Gamification({ userId });
    // Sumar puntos por tarea completada
    gam.points += 10;
    // Lógica de racha: si la última tarea fue ayer o antes, reinicia; si fue hoy, suma
    const now = new Date();
    const last = gam.lastActive || new Date(0);
    const diff = (now - last) / (1000 * 60 * 60 * 24);
    if (diff < 1.5 && diff > 0.5) {
      gam.streak += 1;
    } else if (diff > 1.5) {
      gam.streak = 1;
    } else if (gam.streak === 0) {
      gam.streak = 1;
    }
    await gam.save();
    return gam;
  }
}

module.exports = GamificationService;
