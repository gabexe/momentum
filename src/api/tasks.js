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

// GET /api/tasks con filtros y paginación
router.get('/', (req, res) => {
  let filtered = [...tasks];
  // Filtros: estado (completed), prioridad, fecha (simulada)
  if (req.query.completed !== undefined) {
    const completed = req.query.completed === 'true';
    filtered = filtered.filter(t => t.completed === completed);
  }
  if (req.query.priority) {
    filtered = filtered.filter(t => t.priority === req.query.priority);
  }
  // Filtro por fecha (simulado, si existiera t.date)
  if (req.query.date) {
    filtered = filtered.filter(t => t.date === req.query.date);
  }
  // Paginación
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);
  res.json({
    total: filtered.length,
    page,
    pageSize,
    tasks: paginated
  });
});

// POST /api/tasks
router.post('/', (req, res) => {
  const task = req.body;
  if (!validateTask(task)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  task.id = idCounter++;
  tasks.push(task);
  res.status(201).json(task);
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'No existe la tarea' });
  const updated = req.body;
  if (!validateTask(updated)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  updated.id = id;
  tasks[index] = updated;
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'No existe la tarea' });
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
