// src/api/feedback.js
const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');

// Memoria simple de contexto conversacional (por userId, para demo)
const sessionContext = {};

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
  // Guardar mensaje en contexto
  sessionContext[userId].push({ role: 'user', content: message });
  // Limitar a 10 mensajes por sesión (se implementará control en subtarea 9.4)
  // Aquí se integrará Gemini en la siguiente subtarea
  return res.status(200).json({ message: 'Mensaje recibido', context: sessionContext[userId] });
});

module.exports = router;
