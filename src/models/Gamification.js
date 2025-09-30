const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  streak: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  penalties: { type: Number, default: 0 },
  lastActive: { type: Date }
});

module.exports = mongoose.model('Gamification', gamificationSchema);
