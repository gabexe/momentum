const express = require('express');
const tasksRouter = require('./api/tasks');
const app = express();

app.use(express.json());
app.use('/api/tasks', tasksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
