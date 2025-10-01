// Simple cache en memoria para priorización
class GeminiService {
  /**
   * Llama a Gemini API con retry y backoff exponencial
   * @param {Array} tasks
   * @param {Object} userContext
   * @param {number} maxRetries
   * @returns {Promise<Object>}
   */
  async prioritizeTasksWithRetry(tasks, userContext, maxRetries = 3) {
    let attempt = 0;
    let delay = 1000;
    while (attempt < maxRetries) {
      try {
        return await this.prioritizeTasks(tasks, userContext);
      } catch (err) {
        attempt++;
        if (attempt >= maxRetries) throw new Error(`Gemini API falló tras ${maxRetries} intentos: ${err.message}`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      }
    }
  }
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

  /**
   * Prioriza tareas usando Gemini API con caché de 1 hora
   */
  async prioritizeTasksWithCache(tasks, userContext) {
    const key = _getCacheKey(tasks, userContext);
    const cached = _getCache(key);
    if (cached) return cached;
    const result = await this.prioritizeTasks(tasks, userContext);
    _setCache(key, result);
    return result;
  }

  /**
   * Parsea y valida la respuesta JSON de Gemini
   * @param {string|object} response - Respuesta de Gemini (string o JSON)
   * @returns {object} - Objeto con orden y justificaciones
   * @throws {Error} - Si el formato es inválido
   */
  static parseGeminiResponse(response) {
    let data;
    if (typeof response === 'string') {
      try {
        data = JSON.parse(response);
      } catch (e) {
        throw new Error('Respuesta de Gemini no es un JSON válido');
      }
    } else {
      data = response;
    }
    if (!data || !Array.isArray(data.order) || !Array.isArray(data.justifications)) {
      throw new Error('Formato de respuesta de Gemini inválido: falta order o justifications');
    }
    if (data.order.length !== data.justifications.length) {
      throw new Error('order y justifications deben tener la misma longitud');
    }
    return data;
  }

  /**
   * Construye un prompt efectivo para priorización de tareas
   * @param {Array} tasks - Lista de tareas
   * @param {Object} userContext - Contexto del usuario
   * @returns {String} - Prompt listo para Gemini API
   */
  static buildPrompt(tasks, userContext) {
    const resumenTareas = tasks.map((t, i) => `Tarea ${i+1}: ${t.title} (estimado: ${t.estimatedTime}min, energía: ${t.energyLevel || 'N/A'})`).join('\n');
    const contexto = `Usuario: ${userContext.name || 'N/A'}\nCalendario: ${userContext.calendar || 'N/A'}\nNivel de energía: ${userContext.energyLevel || 'N/A'}`;
    return `Contexto:\n${contexto}\n\nTareas pendientes:\n${resumenTareas}\n\nPrioriza las tareas considerando calendario, tiempo estimado y energía. Devuelve un JSON con el orden y justificación de cada tarea.`;
  }
}
    const resumenTareas = tasks.map((t, i) => `Tarea ${i+1}: ${t.title} (estimado: ${t.estimatedTime}min, energía: ${t.energyLevel || 'N/A'})`).join('\n');
    const contexto = `Usuario: ${userContext.name || 'N/A'}\nCalendario: ${userContext.calendar || 'N/A'}\nNivel de energía: ${userContext.energyLevel || 'N/A'}`;
    return `Contexto:\n${contexto}\n\nTareas pendientes:\n${resumenTareas}\n\nPrioriza las tareas considerando calendario, tiempo estimado y energía. Devuelve un JSON con el orden y justificación de cada tarea.`;
  }
// src/services/GeminiService.js
// Servicio para integración con Gemini API y priorización de tareas

const axios = require('axios');

class GeminiService {
  /**
   * Prioriza tareas usando Gemini API con caché de 1 hora
   */
  async prioritizeTasksWithCache(tasks, userContext) {
    const key = _getCacheKey(tasks, userContext);
    const cached = _getCache(key);
    if (cached) return cached;
    const result = await this.prioritizeTasks(tasks, userContext);
    _setCache(key, result);
    return result;
  }
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

  /**
   * Construye un prompt efectivo para priorización de tareas
   * @param {Array} tasks - Lista de tareas
   * @param {Object} userContext - Contexto del usuario
   * @returns {String} - Prompt listo para Gemini API
   */
  static buildPrompt(tasks, userContext) {
    const resumenTareas = tasks.map((t, i) => `Tarea ${i+1}: ${t.title} (estimado: ${t.estimatedTime}min, energía: ${t.energyLevel || 'N/A'})`).join('\n');
    const contexto = `Usuario: ${userContext.name || 'N/A'}\nCalendario: ${userContext.calendar || 'N/A'}\nNivel de energía: ${userContext.energyLevel || 'N/A'}`;
    return `Contexto:\n${contexto}\n\nTareas pendientes:\n${resumenTareas}\n\nPrioriza las tareas considerando calendario, tiempo estimado y energía. Devuelve un JSON con el orden y justificación de cada tarea.`;
  }

  /**
   * Parsea y valida la respuesta JSON de Gemini
   * @param {string|object} response - Respuesta de Gemini (string o JSON)
   * @returns {object} - Objeto con orden y justificaciones
   * @throws {Error} - Si el formato es inválido
   */
  static parseGeminiResponse(response) {
    let data;
    if (typeof response === 'string') {
      try {
        data = JSON.parse(response);
      } catch (e) {
        throw new Error('Respuesta de Gemini no es un JSON válido');
      }
    } else {
      data = response;
    }
    if (!data || !Array.isArray(data.order) || !Array.isArray(data.justifications)) {
      throw new Error('Formato de respuesta de Gemini inválido: falta order o justifications');
    }
    if (data.order.length !== data.justifications.length) {
      throw new Error('order y justifications deben tener la misma longitud');
    }
    return data;
  }
}

module.exports = GeminiService;
