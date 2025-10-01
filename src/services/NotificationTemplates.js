// src/services/NotificationTemplates.js
// Plantillas de notificaciones push con tono exigente

module.exports = {
  reminder: (taskTitle) => ({
    title: '¡No hay excusas! Es hora de actuar',
    body: `Tarea pendiente: ${taskTitle}. No postergues, demuestra disciplina.`
  }),
  start: (taskTitle) => ({
    title: 'Comienza YA',
    body: `Inicia la tarea: ${taskTitle}. El tiempo no espera a nadie.`
  }),
  missed: (taskTitle) => ({
    title: 'Oportunidad perdida',
    body: `No completaste: ${taskTitle}. Reflexiona y hazlo mejor mañana.`
  })
};
