# AstroDetect

Herramienta educativa para simular y analizar tránsitos de exoplanetas.

[Abrir la aplicación](https://tbl4z3r.github.io/AstroDetect/) · [Aplicación y documentación](AstroDetect/README.md) · [Informe académico](AstroDetect/docs/informe/informe.pdf)

## Ramas del proyecto

El repositorio mantiene únicamente cuatro ramas permanentes:

- `develop`: desarrollo de las tareas asignadas e integración de cambios.
- `qa`: versión candidata para ejecutar las pruebas y comprobar el comportamiento.
- `main`: código terminado, con las verificaciones de QA completadas. Sigue siendo la rama predeterminada.
- `production`: versión pública. Cada actualización ejecuta sus controles y publica en GitHub Pages únicamente si pasan.

El flujo es `develop → qa → main → production`. No se crean ramas por tarea, auditoría o revisión. Los tres estudiantes conservan copias locales independientes y coordinan las asignaciones antes de editar. QA comprueba el producto; no se requiere revisión de código entre agentes ni aprobación de Claude.

Lee el [protocolo de ramas](AstroDetect/docs/ramas.md) antes de trabajar o publicar. La aplicación continúa en `AstroDetect/`; desde esa carpeta se ejecutan `npm ci` y `npm run dev` con Node 22.12.0.

Las ramas anteriores quedaron registradas con su commit en [el inventario de archivo](AstroDetect/docs/ramas-archivo.json). Los commits que no estaban integrados se conservan mediante etiquetas `archive/2026-10-28/…`; las etiquetas son referencias históricas, no ramas activas.
