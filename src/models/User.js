const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  preferences: { type: Object, default: {} }
});

module.exports = mongoose.model('User', userSchema);
