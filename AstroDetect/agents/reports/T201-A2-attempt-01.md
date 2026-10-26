# Reporte T201 — A2 — Intento 01

- Fecha y versión objetivo: 26 de octubre de 2026; 0.1.0-alpha.
- Estado sugerido: REVIEW. No se modifica el registro compartido ni se declara DONE.
- Tarea y rol: exclusivamente T201, controles y estructura accesible; A2.
- Base de trabajo: `98ffec73e2d81adfc136168ab0330d9441bd1ac9`.
- Rama local y remota: `task/T201`.
- Referencia de código: `d65d3f78789c2433c38cef16f76885b946193754` (implementación en `032ea3812facfa5b7f0589fb75197c90e0e47848`; el siguiente commit sólo normaliza espacios finales de una prueba).
- Reporte previo: ninguno de implementación T201. Los reportes planning-A2 son planificación.
- Dependencia: T000 DONE, con cierre y revisión independiente leídos; contratos compartidos v1/1.0.0.

## Preparación y reserva

La copia local ya existía y estaba limpia. Se conservaron sus archivos e historia. Tras `git fetch origin --prune`, se consultó `origin/main:AstroDetect/agents/tasks/backlog.json`: T000 DONE y T201 READY, owner A2. `git ls-remote` confirmó main en la base indicada; `git merge-base --is-ancestor` devolvió 0. La búsqueda GitHub de PRs T201, en todos los estados, sólo devolvió el PR #2 de cierre T000, sin implementación T201. No había rama remota `task/T201`.

Reserva exclusiva realizada antes de editar mediante `git push --force-with-lease=refs/heads/task/T201: origin 98ffec73e2d81adfc136168ab0330d9441bd1ac9:refs/heads/task/T201`: la expectativa vacía impide sobrescribir una rama existente. Git confirmó `[new branch]` y una consulta remota posterior confirmó exactamente el SHA base. Después se creó la rama local desde ese SHA. La instrucción explícita del usuario exige el nombre exacto sin descripción adicional y prevalece sobre el ejemplo de nombres del protocolo.

Se leyeron AGENTS, README, protocolo, contratos, rol A2, modelo científico, experiencia educativa, ficha T201, backlog, reportes T000 intentos 01–04 y revisiones A3 intentos 01–03. No se reutilizó implementación ajena.

## Alcance realizado

- `src/app/App.tsx`: encabezado permanente «Simulación educativa», salto de navegación y estructura de configuración, observación, medición, interpretación y apoyo. Las secciones pendientes lo dicen expresamente; no hay botones de reproducción, generación o búsqueda que simulen disponibilidad.
- `src/components/ScenarioControls.tsx`: cinco entradas numéricas con etiquetas, unidades, límites inclusivos y mensajes vinculados por campo. Consume `Scenario`, `SCENARIO_LIMITS` y `DEFAULT_SCENARIO`. Conserva entradas vacías o incorrectas sin corregirlas silenciosamente. Semilla entera, incluyendo cero. Restablecimiento accesible de valores iniciales con anuncio textual.
- `src/components/HelpPanel.tsx`: predicción y comparación, datos simulados, masa e inclinación fijas, órbita circular, supuestos y límites de interpretación. Consume `SAMPLING`; no presenta un caso desconocido disponible ni resultados científicos inventados.
- `src/styles/laboratory.css`: bloques adaptables, controles con foco visible y texto ajustable en anchos estrechos; errores indicados por texto además de color.
- `tests/ui/structure.test.tsx`: comprobación de estructura y textos mediante render estático, incorporada a las pruebas centrales existentes.
- `tests/ui/controls.check.ts` y `tests/ui/browser.config.ts`: dos recorridos reales en Chromium. Configuración exclusiva de estas pruebas, sin modificar configuración compartida. Se ejecutan por separado porque CI instala Chromium después de las pruebas centrales.
- Este reporte nuevo, único para el intento.

## Verificación real

Windows/PowerShell, Node 22.12.0, npm 10.9.0 y Chromium de Playwright 1.64.1, usando las dependencias ya instaladas. Comandos desde la subcarpeta de aplicación `AstroDetect`:

- `npm run lint`: aprobado; incluye prohibición de comentarios de código.
- `npm run typecheck`: aprobado en modo estricto.
- `npm test -- --run`: aprobado, 4 archivos y 30 pruebas, incluyendo estructura T201.
- `npm run build`: aprobado; HTML 0.42 kB, CSS 1.40 kB, JavaScript 226.10 kB.
- `npx vitest run --config tests/ui/browser.config.ts`: aprobado, 2 pruebas reales en Chromium. Verifica nombres accesibles de los cinco campos, valores iniciales independientes, extremos inclusivos, valores por debajo/encima, vacío, semilla fraccionaria y entrada no finita. Comprueba `aria-invalid`, mensajes enlazados y conservación de entradas inválidas.
- El mismo recorrido verifica salto al contenido, orden de Tab por los cinco controles, foco visible mediante estilo calculado, edición de semilla por teclado y restablecimiento con Enter y anuncio de estado. Comprueba ancho de documento sin desplazamiento horizontal a 360, 180 y 1280 píxeles. La comprobación de 180 píxeles es un ancho adicional; no se atribuye como prueba del zoom nativo del navegador.
- `npm run test:e2e`: aprobado tras la compilación final; una prueba Chromium de arranque, recarga y recursos en `/AstroDetect/`.
- `git diff 98ffec73e2d81adfc136168ab0330d9441bd1ac9 --check`: aprobado tras normalizar líneas vacías finales de la prueba.

Incidencias y correcciones: el primer intento restringido no encontró el navegador instalado y no permitió crear el archivo temporal requerido por la prueba smoke de descubrimiento. La repetición con acceso al navegador y temporales normales pasó. Un intento e2e encontró el puerto 4173 ocupado por la ejecución anterior; se detuvo esa ejecución y la repetición final pasó. La primera prueba de teclado reutilizaba foco de otro caso: se aisló en una página nueva y se esperó el encabezado. La comprobación adicional de 180 píxeles detectó desbordamiento: se ajustaron leyenda, enlace de salto y título; el recorrido final pasó. También se espera el reajuste de disposición después de cambiar el viewport. Los intentos fallidos no se cuentan como aprobados.

No se ejecutaron instalación limpia, lector de pantalla real, otros navegadores, zoom nativo, auditoría automática integral de accesibilidad ni pruebas científicas de motores aún no integrados. No se afirma aprobación de CI remota en este reporte.

## Decisiones y límites

Se eligieron entradas numéricas nativas sin deslizadores: permiten teclado y precisión sin duplicar controles. La validación es de entrada de interfaz (vacío, finitud, límites compartidos e integridad de semilla). No sustituye `validateScenario` de A1 ni calcula separación física. No se duplican fórmulas científicas, PRNG o detector.

Los valores se editan localmente; no se genera un conjunto de datos ni existe todavía confirmación de escenario contra un motor. La integración y regeneración de datos, invalidación de detecciones, animación y curva pertenecen a tareas posteriores. No se añaden mocks, dependencias, servicios, comentarios, docstrings o TODO. Contratos, registro y configuración compartida permanecen intactos.

## Continuidad y reversión

Publicar únicamente `task/T201` y un único PR hacia main con este reporte. Producción asignará a A3 la revisión de la referencia final y decidirá cualquier cambio de estado, integración o seguimiento. A2 propone REVIEW y se detiene; no asigna al revisor, no toma T202 y no hace merge ni despliegue.

Para revertir, producción puede crear commits que reviertan exclusivamente los commits T201, sin reescribir historia ni cambios ajenos. Retomar sólo con una nueva asignación explícita y criterios concretos.
