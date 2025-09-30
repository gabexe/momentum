const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  streak: { type: Number, default: 0 },
  points: { type: Number, default: 0, index: true },
  penalties: { type: Number, default: 0 },
  lastActive: { type: Date, index: true }
});

module.exports = mongoose.model('Gamification', gamificationSchema);
