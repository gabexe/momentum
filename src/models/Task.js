const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, index: true },
  description: { type: String },
  dueDate: { type: Date, index: true },
  estimatedTime: { type: Number },
  energyLevel: { type: String },
  status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending', index: true },
  completedAt: { type: Date },
  verificationImage: { type: String }
});

module.exports = mongoose.model('Task', taskSchema);
