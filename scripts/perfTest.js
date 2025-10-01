// Script de pruebas de rendimiento para consultas MongoDB
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Task = require('../src/models/Task');
const IALog = require('../src/models/IALog');
const Gamification = require('../src/models/Gamification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/momentum';

async function runPerformanceTests() {
  await mongoose.connect(MONGODB_URI);
  const results = {};

  // Prueba: Buscar usuario por email
  const t0 = Date.now();
  await User.findOne({ email: 'test@example.com' });
  results.userByEmail = Date.now() - t0;

  // Prueba: Listar tareas por usuario y status
  const t1 = Date.now();
  await Task.find({ userId: 'someUserId', status: 'pending' }).limit(10);
  results.tasksByUser = Date.now() - t1;

  // Prueba: Consultar logs IA por tipo
  const t2 = Date.now();
  await IALog.find({ type: 'prompt' }).limit(10);
  results.iaLogs = Date.now() - t2;

  // Prueba: Ranking de gamificación
  const t3 = Date.now();
  await Gamification.find().sort({ points: -1 }).limit(10);
  results.gamificationRanking = Date.now() - t3;

  await mongoose.disconnect();
  console.log('Resultados de pruebas de rendimiento (ms):', results);
}

runPerformanceTests().catch(err => {
  console.error('Error en pruebas de rendimiento:', err);
  process.exit(1);
});
