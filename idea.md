
# 1. Visión y Usuario Objetivo

| Aspecto           | Descripción                                                                                                                                         |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Visión**        | Ser la aplicación minimalista de gestión de tareas que transforma la procrastinación en disciplina estricta a través de la guía y verificación de la Inteligencia Artificial. |
| **Usuario Objetivo** | Individuos con 0 disciplina y 0 motivación que necesitan un sistema de responsabilidad externa fuerte y sin concesiones (el "coach estricto").         |
| **Propuesta de Valor** | La aplicación no se conforma con listas de tareas; ordena, notifica de forma estricta y utiliza la IA para verificar la completitud de la tarea, eliminando la auto-negociación. |

---

# 2. Arquitectura de Características Clave (Gemini API)

El corazón de Momentum reside en tres interacciones críticas con la IA:

## A. Ordenamiento Inteligente y Estricto de Tareas (Priorización)

- **Objetivo:** Determinar la secuencia de tareas más eficiente y disciplinada, integrando la rutina del calendario para evitar conflictos y optimizar el tiempo disponible.

**Inputs para la IA:**
1. Lista de tareas del día (con estimación de tiempo).
2. Datos del calendario (eventos fijos, reuniones, tiempo de sueño).
3. Nivel de energía del usuario (autodeclarado o inferido por la IA de la conversación anterior).

**System Instruction (Prompting):**
> "Actúa como un sargento de instrucción de disciplina implacable, pero justo. Tu objetivo es crear un cronograma de tareas diario sin tiempo muerto, minimizando la resistencia. El orden debe ser irrefutable y optimizado. Devuelve la respuesta en formato JSON estricto."

**Output Esperado:**
- Un objeto JSON (`TaskSchedule`) con las tareas reordenadas, incluyendo la hora de inicio y fin sugeridas, y una justificación concisa del porqué de ese orden (para la notificación estricta).

---

## B. Verificación de Tareas por Imagen (Gemini Pro Vision)

- **Objetivo:** Eliminar la ambigüedad en la completitud de la tarea ("¿Ya terminé de limpiar?") mediante el análisis visual.

**Inputs para la IA:**
1. Imagen (Base64) subida por el usuario.
2. Descripción original de la tarea (Ej: "Limpiar y ordenar la cocina").
3. Criterios de finalización (Opcional, definidos por el usuario o sugeridos por la IA).

**System Instruction (Prompting):**
> "Analiza la imagen contra la tarea asignada. Sé hipercrítico y no permitas 'suficientemente bueno'. Evalúa el nivel de completitud en porcentaje y proporciona UN ÚNICO mensaje de retroalimentación estricto."

**Output Esperado:**
- Texto de retroalimentación, por ejemplo:  
    `"70% de completitud. El estante de especias sigue desordenado y el área del fregadero necesita pulirse. ¡Sigue trabajando!"`  
    o  
    `"100% completado. Excelente. Marca la tarea."`

---

## C. Diálogo de Retroalimentación y Planificación (Post-Día)

- **Objetivo:** Reforzar la disciplina y preparar el plan de ataque para el día/semana siguiente en un formato conversacional estricto.

**Inputs para la IA:**
1. Registro de rendimiento del día (Rachas, % de tareas completadas/fallidas).
2. Historial de la conversación.
3. Preguntas del usuario sobre el día siguiente.

**System Instruction (Prompting):**
> "Mantén una personalidad de coach de disciplina AI, severo pero constructivo. Nunca uses lenguaje motivacional blando. Analiza fríamente los fallos y exige una acción correctiva. El tono debe ser formal y exigente."

**Output Esperado:**
- Análisis de rendimiento + Solicitud de tareas para el día siguiente o resumen de lo que el usuario debe mejorar.

---

# 3. Sistema de Motivación Extrínseca (Gamificación Estricta)

Dado que el usuario carece de motivación interna, el sistema debe ser estricto y basado en consecuencias:

- **Puntos de Disciplina:** Acumulados por completitud 100% y manteniendo rachas (Streaks).
- **Rachas (Streaks):** El pilar. Una racha fallida debe tener una penalización inmediata y visible.
- **Penalización:**  
    - La penalización no debe ser virtual (como "perder un punto"), sino funcional y psicológica:
        - **UI Temporalmente "Fea":** Si falla una racha importante, el fondo de la aplicación se torna a un color menos agradable (Ej: gris oscuro monocromático) o la tipografía se vuelve básica, como recordatorio visual.
        - **"Tareas de Castigo":** La IA de Gemini asigna una o dos tareas de "mantenimiento" tediosas al día siguiente (Ej: "limpiar el teclado", "reorganizar el cajón de calcetines") por fallar la racha.

---

# 4. Pila Tecnológica y Modelo de Datos Propuesto

## Pila Tecnológica

| Componente | Propósito |
|------------|-----------|
| **Frontend** | React & Tailwind CSS (Ideal para el diseño minimalista y reactivo). |
| **Backend/Hosting** | Vercel (Para el despliegue rápido y escalable). |
| **Database** | MongoDB (Flexibilidad para almacenar estructuras de datos dinámicas como logs de conversación de la IA y estructuras de tareas complejas). |

## Esquema Básico de MongoDB (Collections)

- **users Collection**
    - `userId` (string, PK)
    - `email` (string)
    - `disciplineScore` (number)
    - `currentStreak` (number)
    - `aiPersonaSettings` (map: almacena el tono o el nombre que el usuario ha dado a la IA)

- **tasks Collection**
    - `taskId` (string, PK)
    - `userId` (string, FK)
    - `description` (string)
    - `status` (enum: 'pending', 'scheduled', 'completed', 'failed')
    - `plannedSchedule` (map: incluye la hora de inicio/fin sugerida por Gemini)
    - `completionImageUrl` (string: URL de la imagen para verificación)
    - `geminiVerificationFeedback` (string: el último feedback estricto de la IA)

- **aiConversations Collection**
    - `conversationId` (string, PK)
    - `userId` (string, FK)
    - `log` (array of objects: {role: 'user'/'ai', message: 'text', timestamp: date})

---

# 5. Diseño y Experiencia de Usuario (UI/UX)

El diseño minimalista debe centrarse en una tarea a la vez:

- **Pantalla Principal (Focus Mode):** Muestra solo la tarea actual y el tiempo restante sugerido. El botón de interacción principal debe ser "Terminé" (que lleva a la verificación por foto).
- **Notificaciones:** El tono de las notificaciones push debe reflejar el tono estricto de la IA (Ej: "Tu descanso termina en 5 minutos. No lo arruines. Tarea 'X' inicia ahora.").
- **Dashboard (Rachas):** Un área secundaria muestra el status de la racha de forma prominente.

---
