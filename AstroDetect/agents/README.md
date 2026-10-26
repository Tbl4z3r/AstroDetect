# Cómo activar a los tres subagentes

Estos roles son instrucciones reutilizables para agentes que trabajen dentro del repositorio. Tener los archivos no crea procesos persistentes ni sesiones nuevas por sí solo.

## Preparación común

Producción termina T000 con revisión de A3 y marca DONE en el registro. Comunica la base real y la versión congelada del contrato. Después prepara una rama y checkout por agente para evitar que las ediciones simultáneas compartan archivos de trabajo. Proporciona siempre README, AGENTS.md, docs/contratos.md y docs/colaboracion.md.

## Primera asignación A1

Lee `agents/instructions/01-ciencia.md` y ejecuta únicamente `agents/tasks/T101.md` cuando producción haya confirmado T000 DONE. Usa la base real que producción adjunte. No implementes T102 todavía. Entrega reporte, referencia y evidencia; detente en REVIEW. A2 será el revisor bajo una asignación posterior.

## Primera asignación A2

Lee `agents/instructions/02-interfaz.md` y ejecuta únicamente `agents/tasks/T201.md` cuando producción haya confirmado T000 DONE. Usa contratos congelados y archivos de la ficha. No implementes T202 todavía. Entrega reporte, referencia y evidencia; detente en REVIEW. A3 será el revisor bajo una asignación posterior.

## Primera asignación A3

Lee `agents/instructions/03-analisis-calidad.md` y ejecuta únicamente `agents/tasks/T301.md` cuando producción haya confirmado T000 DONE. Los fixtures de unidades son independientes de la simulación. No implementes T302 ni recorridos completos todavía. Entrega reporte, referencia y evidencia; detente en REVIEW. A1 será el revisor bajo una asignación posterior.

## Cambio a revisión

Producción indica tarea, reporte y SHA exactos. El agente revisa únicamente esa entrega con `agents/templates/review.md`; no implementa a la vez otra tarea. Rotación: A2 revisa A1, A3 revisa A2 y A1 revisa A3. Si hace falta corrección, se devuelve al autor y luego se revisa el cambio actualizado.

## Qué ya ocurrió en esta entrega

Tres subagentes colaboraron en las especificaciones y sus instrucciones. Sus reportes `planning-A1`, `planning-A2` y `planning-A3` documentan trabajo de planificación, no tareas de implementación. Sus revisiones documentales se conservan en `agents/reviews/`. La implementación sigue el backlog y no se da por ejecutada por existir estos documentos.
