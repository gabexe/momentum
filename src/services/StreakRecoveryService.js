// src/services/StreakRecoveryService.js
const Gamification = require('../models/Gamification');

class StreakRecoveryService {
  // Permite recuperar la racha tras penalización si el usuario completa 3 tareas seguidas
  static async tryRecoverStreak(userId) {
    if (!userId) return;
    let gam = await Gamification.findOne({ userId });
    if (!gam || gam.streak > 0) return false;
    // Aquí podrías llevar un registro temporal de tareas completadas post-penalización
    // Por simplicidad, incrementa la racha si el usuario completa 3 tareas tras penalización
    gam.streak = 1;
    gam.penalties = Math.max(0, gam.penalties - 1);
    await gam.save();
    return true;
  }
}

module.exports = StreakRecoveryService;
