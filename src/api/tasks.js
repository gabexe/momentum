const express = require('express');
const router = express.Router();

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
