const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    index: true,
    match: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Email inválido']
  },
  name: { type: String, trim: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    index: true
  },
  createdAt: { type: Date, default: Date.now, index: true },
  preferences: { type: Object, default: {} }
});

// Middleware para normalizar email antes de guardar
userSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
