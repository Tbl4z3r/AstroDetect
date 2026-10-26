# Protocolo de colaboración y retroactividad

## Fuente de contexto y precedencia

La instrucción explícita vigente del equipo prevalece. Después rigen AGENTS.md, contrato central aprobado, tarea asignada y rol. Si dos documentos técnicos discrepan, detener sólo la parte afectada y pedir resolución al productor. El contrato de docs/contratos.md prevalece sobre ejemplos de otros documentos; cualquier cambio debe quedar registrado. La documentación describe requisitos, no resultados de pruebas.

El productor actualiza README, contratos, backlog, configuración compartida y CHANGELOG. Los agentes escriben únicamente en el alcance de su ficha y en archivos nuevos de reporte/revisión. No comparten un reporte acumulativo editable. Los estados de la ficha y registro los sincroniza sólo el productor.

## Máquina de estados

`BACKLOG → READY → IN_PROGRESS → REVIEW → DONE`.

`REVIEW → CHANGES_REQUESTED → IN_PROGRESS → REVIEW` para correcciones. `BLOCKED` puede interrumpir cualquier estado activo y guarda estado previo, motivo y responsable; sólo el productor lo reactiva al resolverse. `CANCELLED` requiere decisión explícita del productor y motivo. En este paquete los BLOCKED se deben a predecesoras no finalizadas.

READY exige dependencias DONE, alcance y archivos definidos, criterios medibles, herramientas y contexto disponibles. IN_PROGRESS exige asignación explícita y base de trabajo registrada. REVIEW exige entrega y pruebas necesarias ejecutadas con resultado, o pendientes claramente identificados que impedirán el cierre. DONE exige revisión independiente aprobada en el SHA final, controles requeridos aprobados, integración del cambio y registro del productor. Entregar documentos no equivale a terminar las tareas de implementación.

Un agente no modifica el registro para declararse terminado: informa estado sugerido en su reporte. Si no quedan acciones autorizadas, se detiene aun cuando existan otras tareas READY.

## Asignación mínima

Cada orden contiene ID de ficha, agente autor, revisor, rama/base, archivos permitidos y evidencia esperada. Si se pide implementar sin ID, el productor crea primero la ficha. Si falta una decisión que no afecta otras partes, avanzar sólo en lo independiente. Nunca sustituir una dependencia inexistente por un contrato inventado.

## Ramas, integración y conflictos

Una tarea por rama `task/T101-descripcion` y un checkout independiente por agente cuando haya edición simultánea. No ejecutar tres agentes que escriban el mismo directorio de trabajo. Las tareas sólo leen contratos congelados desde la misma base o desde una base actualizada explícitamente. Commits pequeños con ID: `feat(T101): ...`, `fix(T301): ...`, `docs(T404): ...`.

El productor integra PRs pequeños en orden de dependencias. Si no hay rama base porque el repositorio está vacío, primero incorpora esta planificación mediante un commit inicial autorizado y después crea ramas. No se pueden abrir PRs contra una rama inexistente. Prohibidos force-push a main y reescritura de historia compartida. Ante conflicto, conservar ambas intenciones, resolver, ejecutar nuevamente las verificaciones afectadas y pedir revisión si cambia el comportamiento.

## Reportes, revisiones y memoria de versiones

- Tareas: `agents/tasks/Txxx.md`, estables salvo cambio autorizado del productor.
- Registro: `agents/tasks/backlog.json`, única fuente de estados.
- Reportes: `agents/reports/Txxx-Ax-attempt-01.md` con un archivo por intento.
- Revisiones: `agents/reviews/Txxx-reviewer-Ay-attempt-01.md`.
- Evidencias: `agents/evidence/Txxx/`, sólo archivos pequeños necesarios, sin binarios enormes ni node_modules.
- Historial: CHANGELOG agrupado por versión, actualizado sólo por el productor al integrar.

Cada reporte enlaza reporte anterior, base y entrega, dependencias, decisiones, pruebas, limitaciones, reversión y siguiente responsable. Las revisiones identifican exactamente qué entrega cubren. Si hay corrección, crear otro intento y conservar el anterior; no borrar hallazgos históricos.

## Revisión especializada

A2 revisa A1; A3 revisa A2; A1 revisa A3. La tarea es una revisión limitada a los criterios del cambio y riesgos reales, no una invitación a reescribir el módulo. Leer el diff y ejecutar verificaciones pertinentes. Un hallazgo lleva severidad, archivo, reproducción, resultado esperado y observado. Diferenciar fallas bloqueantes de sugerencias opcionales.

El autor corrige; el revisor revalida la nueva referencia. Si el revisor implementa una corrección, un tercero revisa esa parte. No usar el rol de tester para autoaprobar código propio. Producción integra; aprobación de revisión por sí sola no cambia el estado a DONE.

Para configuración escrita por producción, A3 revisa. Para una integración escrita por A3, A1 revisa. Cuando no haya código ejecutable, revisar enlaces, consistencia de contratos, cobertura de tareas y honestidad de estados; no afirmar pruebas funcionales.

## Regla de parada

Entregar y detenerse cuando la tarea alcanza REVIEW, queda BLOCKED o recibe cancelación. No empezar otra tarea, publicar, añadir mejoras o revisar espontáneamente módulos adicionales. Una mejora se registra en el apartado fuera de alcance del reporte. Corregir una regresión de una tarea cerrada exige una nueva ficha F-ID vinculada al cambio original.
