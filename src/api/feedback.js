// src/api/feedback.js
const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');

// Memoria simple de contexto conversacional (por userId, para demo)
const sessionContext = {};

const GeminiService = require('../services/GeminiService');
const Task = require('../models/Task');

// POST /api/feedback - inicia o continúa conversación
router.post('/', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'userId inválido' });
  }
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }
  // Inicializar contexto si no existe
  if (!sessionContext[userId]) {
    sessionContext[userId] = [];
  }
  // Lógica de límite de mensajes (máx 10 por sesión)
  if (sessionContext[userId].length >= 20) { // 10 usuario + 10 IA
    return res.status(200).json({
      aiResponse: 'Has alcanzado el límite de 10 mensajes en esta sesión de feedback. Si necesitas más ayuda, inicia una nueva sesión.',
      context: sessionContext[userId],
      sessionEnded: true
    });
  }
  // Guardar mensaje en contexto
  sessionContext[userId].push({ role: 'user', content: message });

  // Obtener tareas fallidas del usuario (últimas 24h)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const failedTasks = await Task.find({ userId, status: { $ne: 'done' }, updatedAt: { $gte: since } });
  const failedSummary = failedTasks.map(t => `- ${t.title}: ${t.description || ''}`).join('\n');

  // Construir prompt para Gemini
  const prompt = `Eres un coach hipercrítico. Analiza el siguiente mensaje del usuario y su desempeño diario.\n\nTareas fallidas hoy:\n${failedSummary || 'Ninguna'}\n\nHistorial de conversación:\n${sessionContext[userId].map(m => m.role+': '+m.content).join('\n')}\n\nResponde con feedback estricto, sugerencias y preguntas para mejorar el rendimiento.`;

  // Llamar Gemini API
  const gemini = new GeminiService();
  let aiResponse;
  try {
    aiResponse = await gemini.prioritizeTasks([{ title: 'feedback', description: prompt }], {});
    // Simulación: usar el campo 'order' o 'justifications' como respuesta
    aiResponse = aiResponse.justifications ? aiResponse.justifications[0] : JSON.stringify(aiResponse);
  } catch (err) {
    aiResponse = 'No se pudo obtener respuesta de IA: ' + err.message;
  }
  // Guardar respuesta en contexto
  sessionContext[userId].push({ role: 'ai', content: aiResponse });
  return res.status(200).json({ aiResponse, context: sessionContext[userId] });
});

module.exports = router;
