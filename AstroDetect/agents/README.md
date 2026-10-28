# Trabajo por tareas y cuatro ramas

La política vigente conserva entrega directa sin revisión cruzada ni auditoría de Claude. Cada autor verifica su entrega, registra evidencia, propone DELIVERED y se detiene. Sólo producción integra, registra DONE y asigna el siguiente ID.

Cada persona recibe un ID, rol funcional, archivos permitidos y criterios de término. Lee AGENTS, contratos, ficha, registro remoto y [protocolo de ramas](../docs/ramas.md). No ejecutes tareas ya terminadas ni tomes otra por iniciativa propia.

Existen sólo `develop`, `qa`, `main` y `production`. Las tareas se implementan en `develop`, desde clones independientes y con archivos coordinados. No crear ramas por tarea, revisión o auditoría; los nombres de ramas de los reportes históricos no deben recrearse. Producción coordina `develop → qa → main → production`; sólo la última publica la web.

Las asignaciones se mantienen en `tasks/backlog.json` y `tasks/asignaciones-actuales.md`. Los reportes están en `reports/`, separados de las fichas en `tasks/`. Conservar el historial y no reorganizar archivos como parte de otra tarea.
