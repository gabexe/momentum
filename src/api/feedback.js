// src/api/feedback.js
const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');

// POST /api/feedback - inicia conversación
router.post('/', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'userId inválido' });
  }
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }
  // Aquí se implementará la lógica de contexto y Gemini en las siguientes subtareas
  return res.status(200).json({ message: 'Conversación iniciada', userId, firstMessage: message });
});

module.exports = router;
