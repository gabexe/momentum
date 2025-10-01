const mongoose = require('mongoose');

const notificationPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  enabled: { type: Boolean, default: true },
  lastRejected: { type: Date },
  channels: { type: [String], default: ['push'] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NotificationPreferences', notificationPreferencesSchema);