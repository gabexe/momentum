const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'userId es obligatorio'], index: true },
  streak: { type: Number, default: 0, min: 0 },
  points: { type: Number, default: 0, index: true, min: 0 },
  penalties: { type: Number, default: 0, min: 0 },
  lastActive: { type: Date, index: true }
});

// Middleware para actualizar lastActive
gamificationSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

module.exports = mongoose.model('Gamification', gamificationSchema);
