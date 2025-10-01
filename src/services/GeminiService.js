// src/services/GeminiService.js
// Servicio para integración con Gemini API y priorización de tareas

const axios = require('axios');

class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.baseUrl = process.env.GEMINI_API_URL || 'https://api.gemini.com/prioritize';
  }

  /**
   * Prioriza tareas usando Gemini API
   * @param {Array} tasks - Lista de tareas a priorizar
   * @param {Object} userContext - Contexto del usuario (calendario, energía, etc)
   * @returns {Promise<Object>} - Orden de tareas y justificaciones
   */
  async prioritizeTasks(tasks, userContext) {
    try {
      const response = await axios.post(
        this.baseUrl,
        { tasks, userContext },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );
      return response.data;
    } catch (error) {
      // Manejo robusto de errores
      if (error.response) {
        throw new Error(`Gemini API error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No se recibió respuesta de Gemini API');
      } else {
        throw new Error(`Error al llamar Gemini API: ${error.message}`);
      }
    }
  }
}

module.exports = GeminiService;
