const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  estimatedTime: { type: Number },
  energyLevel: { type: String },
  status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
  completedAt: { type: Date },
  verificationImage: { type: String }
});

module.exports = mongoose.model('Task', taskSchema);
