const express = require('express');
const router = express.Router();

// Endpoint para verificación de tarea por imagen (base64)
const { Types } = require('mongoose');

// POST /api/tasks/:id/verify
const GeminiService = require('../services/GeminiService');
const S3Service = require('../services/S3Service');
const Task = require('../models/Task');

router.post('/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { imageBase64 } = req.body;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de tarea inválido' });
  }
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'Imagen base64 requerida' });
  }
  // Validar tamaño y formato (PNG, JPG, JPEG, <5MB)
  const sizeBytes = Buffer.byteLength(imageBase64, 'base64');
  if (sizeBytes > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'La imagen excede 5MB' });
  }
  // Detectar formato por cabecera base64
  let ext = 'png';
  if (imageBase64.startsWith('/9j/')) ext = 'jpg';
  if (imageBase64.startsWith('iVBOR')) ext = 'png';
  if (imageBase64.startsWith('/+')) ext = 'jpeg';
  if (!['png', 'jpg', 'jpeg'].includes(ext)) {
    return res.status(400).json({ error: 'Formato de imagen no soportado (solo PNG, JPG, JPEG)' });
  }
  // Buscar tarea y descripción
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
  // Guardar imagen en S3
  const imageKey = `tasks/${id}/image_${Date.now()}.${ext}`;
  const imageUrl = await S3Service.uploadImage(imageKey, imageBase64);
  // Construir prompt y analizar con Gemini Vision
  const prompt = GeminiService.buildStrictVisionPrompt(task.description || task.title);
  const gemini = new GeminiService();
  let visionResult;
  try {
    visionResult = await gemini.analyzeImageWithVision(imageBase64, prompt);
  } catch (err) {
    return res.status(502).json({ error: 'Error en Gemini Vision', details: err.message });
  }
  // Guardar resultado en S3
  const resultKey = `tasks/${id}/result_${Date.now()}.json`;
  const resultUrl = await S3Service.uploadResult(resultKey, visionResult);
  // Actualizar estado de la tarea si completitud >= 90
  if (typeof visionResult.completitud === 'number' && visionResult.completitud >= 90) {
    task.status = 'done';
    await task.save();
  }
  return res.status(200).json({
    message: 'Verificación procesada',
    imageUrl,
    resultUrl,
    completitud: visionResult.completitud,
    feedback: visionResult.feedback,
    taskStatus: task.status
  });
});


// Validación simple de datos
function validateTask(data) {
  if (!data.title || typeof data.title !== 'string') return false;
  if (data.completed !== undefined && typeof data.completed !== 'boolean') return false;
  return true;
}

// Simulación de base de datos en memoria
let tasks = [];
let idCounter = 1;

// GET /api/tasks con filtros y paginación y respuesta estándar
router.get('/', (req, res) => {
  let filtered = [...tasks];
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === 'true';
    filtered = filtered.filter(t => t.completed === completed);
  }
  if (req.query.priority) {
    filtered = filtered.filter(t => t.priority === req.query.priority);
  }
  if (req.query.date) {
    filtered = filtered.filter(t => t.date === req.query.date);
  }
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);
  res.json({
    success: true,
    total: filtered.length,
    page,
    pageSize,
    tasks: paginated
  });
});

// POST /api/tasks
router.post('/', (req, res, next) => {
  try {
    const task = req.body;
    if (!validateTask(task)) {
      const err = new Error('Datos inválidos');
      err.status = 400;
      throw err;
    }
    task.id = idCounter++;
    tasks.push(task);
    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id
router.put('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      const err = new Error('No existe la tarea');
      err.status = 404;
      throw err;
    }
    const updated = req.body;
    if (!validateTask(updated)) {
      const err = new Error('Datos inválidos');
      err.status = 400;
      throw err;
    }
    updated.id = id;
    tasks[index] = updated;
    res.json({ success: true, task: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      const err = new Error('No existe la tarea');
      err.status = 404;
      throw err;
    }
    tasks.splice(index, 1);
    res.json({ success: true, message: 'Tarea eliminada' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
