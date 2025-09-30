const express = require('express');
const tasksRouter = require('./api/tasks');
const app = express();

app.use(express.json());
app.use('/api/tasks', tasksRouter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
