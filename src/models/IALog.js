const mongoose = require('mongoose');

const iaLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'userId es obligatorio'], index: true },
  type: { type: String, required: [true, 'El tipo es obligatorio'], index: true, enum: ['prompt', 'completion', 'error'] },
  input: { type: Object },
  output: { type: Object },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Middleware para registrar timestamp si no existe
iaLogSchema.pre('save', function(next) {
  if (!this.timestamp) {
    this.timestamp = new Date();
  }
  next();
});

module.exports = mongoose.model('IALog', iaLogSchema);
