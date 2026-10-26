# Revisión T000 — A3 — Intento 01

- Fecha: 26 de octubre de 2026.
- Autor del cambio: PRODUCTOR.
- Revisor independiente: subagente A3; no participó en la implementación.
- Referencia exacta revisada: `adf78ca07f248709606ad00e849b5b210c638853`; código en `b4b8803a361e6f16d56c98074e6267fd517d3528`, base `085da46f71f841dcacdc5ac6756425c1c0288781`.
- Tarea y reporte: `agents/tasks/T000.md`, `agents/reports/T000-PRODUCTOR-attempt-01.md`.
- Veredicto: CHANGES_REQUESTED.

## Evidencia

Se leyeron AGENTS, README, protocolo, plan, contratos, rol A3, ficha T000, plantilla, reporte y documentación de calidad. Se inspeccionaron todos los archivos de configuración y código añadidos; se contrastaron tipos, límites, firmas y convenciones con el contrato y las constantes del modelo científico. La aplicación sólo presenta la pantalla de arranque; no implementa física, controles, animación ni detector.

Reproducción independiente en Windows/PowerShell con Node 22.12.0, npm 10.9.0 y Chromium Headless Shell 156 / Playwright 1.64.1, desde la subcarpeta `AstroDetect`:

- `npm ci`: aprobado; 189 paquetes añadidos, 190 auditados y cero vulnerabilidades informadas. Emite advertencia de soporte de ESLint 9.39.5, ya declarada por el autor.
- `npm run lint`: aprobado; incluye el control de comentarios.
- `npm run typecheck`: aprobado.
- `npm test -- --run`: aprobado para las pruebas actualmente descubiertas; 2 archivos, 28 pruebas.
- `npm run build`: aprobado; HTML de 0.33 kB y recurso JavaScript de 219.80 kB.
- `npm run test:e2e`: aprobado; una prueba Chromium, carga de `/AstroDetect/`, recarga y recursos sin fallos registrados.
- `git diff --check` sobre el diff asignado y el árbol de trabajo: aprobado.
- Prueba adicional del control de comentarios mediante Node sin modificar fuentes: ocho casos aprobados; JSX, expresión en plantilla, literal de plantilla con apariencia de comentario, expresión regular con barras, comentario dentro de función, comentario final, comentario dentro de template HTML y URL HTML. Se distinguieron comentarios reales de literales.
- Prueba independiente de descubrimiento con la configuración entregada y un directorio temporal: un test smoke válido y un archivo `tests/analysis/probe.test.ts` que lanza un error deliberado. `vitest run --root <temporal> --config <ruta-absoluta>/vitest.config.ts` terminó con código 0, un archivo y una prueba aprobados; omitió el archivo de análisis. Directorio de reproducción: `C:/Users/marga/AppData/Local/Temp/t000-a3-discovery-CzOM7w`.

El workflow se ubica correctamente en la raíz Git, usa la subcarpeta de aplicación y declara sólo `contents: read`. Su ejecución en GitHub no fue observada por A3; la revisión local no equivale a CI remota aprobada. Otros sistemas operativos, otros navegadores y funciones del MVP están fuera de esta revisión.

## Hallazgos

### T000-A3-01 — Media — El control central omite las carpetas de pruebas de los agentes

- Archivo: `vitest.config.ts:2`.
- Reproducción: usar esa configuración con un test válido bajo `tests/smoke/` y un test que falla bajo `tests/analysis/`. La prueba aislada descrita arriba devolvió éxito y sólo descubrió smoke. El mismo patrón excluye `tests/simulation/` y `tests/ui/`.
- Esperado: `npm test -- --run`, que también ejecuta CI, descubre las pruebas unitarias en las carpetas acordadas por la arquitectura, dejando los recorridos e2e a Playwright.
- Observado: `include: ['tests/smoke/**/*.test.ts']` limita toda la suite a smoke. Los agentes no tienen autorización para corregir configuración compartida en sus tareas.
- Impacto: los controles pueden informar éxito aunque fallen pruebas científicas, de interfaz o de análisis incorporadas al seguir la estructura aprobada. La base no queda preparada para el desarrollo paralelo descrito en T000.
- Acción solicitada: ampliar el patrón de pruebas unitarias al árbol `tests`, incluyendo TS/TSX según corresponda y excluyendo explícitamente e2e. Verificar el descubrimiento de las carpetas acordadas y repetir la suite; no implementar funcionalidades de esas tareas para hacerlo.

No se identificaron otros defectos que impidan aceptar el alcance técnico actual. Esto no afirma ausencia universal de fallos.

## Revalidación y cierre

Producción corrige T000-A3-01 y entrega un SHA nuevo y reporte del siguiente intento, conservando este informe. A3 debe revalidar la referencia corregida antes de aprobar. La aprobación y el cierre siguen pendientes; producción decide integración y DONE conforme al protocolo. A3 no modificó código, registro, contratos ni configuración y se detiene tras esta entrega.
