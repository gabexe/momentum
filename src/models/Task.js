const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'userId es obligatorio'], index: true },
  title: { type: String, required: [true, 'El título es obligatorio'], index: true, trim: true, minlength: 3 },
  description: { type: String, maxlength: 500 },
  dueDate: { type: Date, index: true },
  estimatedTime: { type: Number, min: 0 },
  energyLevel: { type: String, enum: ['low', 'medium', 'high'] },
  status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending', index: true },
  completedAt: { type: Date },
  verificationImage: { type: String }
});

// Middleware para establecer status en 'pending' si no se define
taskSchema.pre('save', function(next) {
  if (!this.status) {
    this.status = 'pending';
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
