const mongoose = require('mongoose');

const iaLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true, index: true },
  input: { type: Object },
  output: { type: Object },
  timestamp: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('IALog', iaLogSchema);
