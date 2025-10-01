// src/services/PenaltyService.js
const Gamification = require('../models/Gamification');

class PenaltyService {
  // Penaliza al usuario deshabilitando features por 24h
  static async applyPenalty(userId) {
    if (!userId) return;
    let gam = await Gamification.findOne({ userId });
    if (!gam) gam = new Gamification({ userId });
    gam.penalties += 1;
    gam.streak = 0;
    await gam.save();
    // Aquí se podría guardar un registro de penalización con timestamp
    return gam;
  }
}

module.exports = PenaltyService;
