# Project Definition Report (PDR) - Momentum

**Proyecto:** Momentum  
**Versión:** 1.0  

---

## 1. Resumen Ejecutivo

### 1.1 Descripción General
Momentum es una aplicación minimalista de gestión de tareas diseñada para combatir la procrastinación y fomentar la disciplina estricta mediante el uso de Inteligencia Artificial (IA). La app actúa como un "coach estricto" que no solo organiza tareas, sino que las verifica de manera objetiva y aplica consecuencias reales por incumplimientos, eliminando la auto-negociación y promoviendo la responsabilidad externa.

**Problema que resuelve:** Muchos individuos luchan con la falta total de disciplina y motivación, lo que resulta en procrastinación crónica, listas de tareas abandonadas y un ciclo de baja productividad. Las apps tradicionales de tareas dependen de la motivación interna del usuario, que a menudo falla.

**Solución propuesta:** Momentum integra IA (basada en Gemini API) para priorizar tareas inteligentemente, verificar completitud mediante análisis de imágenes y proporcionar retroalimentación estricta. Incluye gamificación con rachas y penalizaciones funcionales para reforzar hábitos.

**Valor agregado:** Transforma usuarios pasivos en disciplinados mediante verificación objetiva, notificaciones implacables y penalizaciones visibles, logrando tasas de completitud más altas y rachas sostenidas, lo que mejora la productividad diaria y el bienestar mental.

### 1.2 Objetivos del Proyecto
- **Objetivo Principal:** Desarrollar y lanzar un MVP de Momentum que integre IA para gestión estricta de tareas, logrando al menos 80% de completitud en pruebas beta con 50 usuarios en los primeros 3 meses post-lanzamiento (SMART: Specific, Measurable, Achievable, Relevant, Time-bound).
- **Objetivos Secundarios:**
  - Implementar priorización inteligente de tareas basada en IA, reduciendo conflictos de calendario en un 90% para usuarios con rutinas fijas, en las primeras 6 semanas de desarrollo.
  - Integrar verificación por imagen con Gemini Pro Vision, alcanzando precisión de evaluación del 95% en pruebas internas, completado en 2 meses.
  - Establecer un sistema de gamificación con penalizaciones, midiendo un aumento del 50% en rachas diarias entre usuarios beta, evaluado al final del trimestre inicial.

---

## 2. Contexto y Justificación

### 2.1 Antecedentes
En un mundo cada vez más distraído por notificaciones y multitarea, la procrastinación afecta a millones, resultando en estrés, baja productividad y problemas de salud mental. Momentum surge de la necesidad de un sistema externo que imponga disciplina, inspirado en enfoques como el "accountability coaching" pero automatizado con IA para accesibilidad masiva.

### 2.2 Análisis de Mercado
- **Target Audience:** Individuos de 18-35 años con baja motivación (estudiantes, freelancers, profesionales remotos) que buscan herramientas estrictas; estimado en 20% del mercado de apps de productividad (basado en datos de apps como Habitica o Todoist).
- **Competidores Existentes:** Todoist (enfoque en listas flexibles, pero sin verificación IA); Forest (gamificación contra distracciones, pero no estricta); Beeminder (apuestas monetarias, pero compleja). Momentum se diferencia por su IA hipercrítica y penalizaciones funcionales.
- **Oportunidad de Mercado:** El mercado de apps de productividad crece un 15% anual; hay demanda por herramientas "no complacientes" en nichos como ADHD o recuperación de hábitos, con potencial para monetización vía suscripciones premium.

### 2.3 Justificación Técnica
La solución utiliza Gemini API para procesamiento inteligente, ya que ofrece capacidades multimodales (texto e imagen) ideales para verificación visual y diálogos estrictos. MongoDB proporciona flexibilidad para datos dinámicos como logs de IA, mientras que React asegura una UI minimalista y responsive, minimizando overhead para un MVP rápido.

---

## 3. Requisitos del Sistema

### 3.1 Requisitos Funcionales
#### RF001: Priorización Inteligente de Tareas
- **Descripción:** La IA ordena tareas diarias integrando calendario, estimaciones de tiempo y niveles de energía, generando un cronograma estricto en JSON.
- **Prioridad:** Alta
- **Criterios de Aceptación:**
  - Genera cronograma sin conflictos en <5 segundos.
  - Incluye justificaciones concisas para cada orden.

#### RF002: Verificación por Imagen
- **Descripción:** Usuario sube foto; IA analiza contra descripción de tarea, proporcionando feedback estricto y porcentaje de completitud.  
- **Prioridad:** Alta
- **Criterios de Aceptación:**
  - Precisión >95% en pruebas con imágenes variadas.
  - Feedback hipercrítico, negando "suficientemente bueno".

#### RF003: Diálogo de Retroalimentación
- **Descripción:** Conversación post-día con IA para analizar rendimiento y planificar siguiente día, manteniendo tono estricto.
- **Prioridad:** Media
- **Criterios de Aceptación:**
  - Mantiene historial de conversaciones.
  - Exige acciones correctivas basadas en fallos.

#### RF004: Sistema de Gamificación
- **Descripción:** Acumula puntos por completitud, rastrea rachas y aplica penalizaciones (UI degradada, tareas de castigo).
- **Prioridad:** Media
- **Criterios de Aceptación:**
  - Penalizaciones activan automáticamente al fallar racha.
  - UI cambia visualmente por 24 horas post-fallo.

#### RF005: Notificaciones Estrictas
- **Descripción:** Envía push notifications con tono exigente para inicios de tareas y recordatorios.
- **Prioridad:** Alta
- **Criterios de Aceptación:**
  - Integración con dispositivos móviles.
  - Personalización basada en preferencias de usuario.

### 3.2 Requisitos No Funcionales
#### RNF001: Rendimiento
- **Tiempo de respuesta:** < 3 segundos para llamadas a IA.
- **Usuarios concurrentes:** 100 usuarios.
- **Disponibilidad:** 99.5%.

#### RNF002: Seguridad  
- **Autenticación:** OAuth con Google/Email.
- **Autorización:** Roles usuario/admin.
- **Protección de datos:** Cumplir GDPR; encriptar imágenes y logs.

#### RNF003: Usabilidad
- **Compatibilidad:** Web/Mobile (iOS/Android browsers).
- **Accesibilidad:** WCAG 2.1 Level AA.
- **Experiencia de usuario:** Interfaz minimalista; tiempo de carga <2s.

#### RNF004: Escalabilidad
- **Crecimiento esperado:** De 100 a 10,000 usuarios en 1 año.
- **Arquitectura:** Serverless con Vercel para auto-escalado.

---

## 4. Arquitectura Técnica Propuesta

### 4.1 Stack Tecnológico
#### Frontend
- **Framework:** React
- **Librerías UI:** Tailwind CSS
- **Herramientas de Build:** Vite

#### Backend  
- **Runtime/Framework:** Node.js con Next.js
- **API:** RESTful con integración Gemini API
- **Autenticación:** JWT/OAuth

#### Base de Datos
- **Tipo:** NoSQL
- **Sistema:** MongoDB
- **ORM/ODM:** Mongoose

#### DevOps e Infraestructura
- **Hosting:** Vercel
- **CI/CD:** GitHub Actions
- **Monitoreo:** Sentry

### 4.2 Diagrama de Arquitectura
```
Cliente (Web/Mobile)
     ↓
API Gateway (Vercel)
     ↓
Aplicación Backend (Next.js)
     ↓
Base de Datos (MongoDB)
     ↔
Gemini API (para IA)
```

### 4.3 Flujo de Datos Principal
1. Usuario ingresa tareas y calendario; frontend envía a backend.
2. Backend llama a Gemini para priorización; almacena en DB.
3. Usuario sube imagen; backend procesa con Gemini Vision, actualiza estado y aplica gamificación.

---

## 5. Scope del Proyecto

### 5.1 Funcionalidades Incluidas (MVP)
- ✅ Priorización inteligente de tareas.
- ✅ Verificación por imagen.
- ✅ Diálogo de retroalimentación.
- ✅ Gamificación básica (rachas, penalizaciones).

### 5.3 Exclusiones Explícitas
- ❌ Integración con calendarios externos (e.g., Google Calendar) en MVP.
- ❌ Soporte offline completo.

---

## 6. Stakeholders

### Usuario Final: Estudiante procrastinador: Necesita estructura diaria estricta.

---