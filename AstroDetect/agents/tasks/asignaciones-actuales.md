# Estado de las asignaciones — 28 de octubre de 2026

La implementación del MVP, su publicación y el informe académico están integrados. T406 y T407 también se incorporaron mediante los PR #15 y #16. No hay una tarea nueva asignada a los compañeros. T405 permanece en BACKLOG como extensión futura y no debe iniciarse sin una asignación expresa.

Política vigente: entrega directa sin revisión cruzada ni auditoría. Cada autor verifica su propia entrega; producción integra y registra DONE.

## Organización de ramas

Por instrucción del equipo, el repositorio mantiene sólo `develop`, `qa`, `main` y `production`. El flujo es develop → qa → main → production; sólo production publica GitHub Pages. Las ramas por tarea, revisión o auditoría fueron retiradas conservando sus commits y reportes. Consulta [el protocolo](../../docs/ramas.md).

Los compañeros deben actualizar sus referencias con `git fetch --prune origin`. Con su trabajo guardado y la copia limpia, pasar a develop y actualizar con avance rápido antes de la siguiente asignación. No borrar ramas locales con trabajo ni recrear ramas históricas.

Producción debe asignar un único ID activo y archivos separados a cada persona. No se asignan revisores de código; las comprobaciones de QA se realizan sobre una candidata concreta.
