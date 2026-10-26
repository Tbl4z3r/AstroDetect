# Revisión T201 — A3 — Intento 01

- Fecha: 26 de octubre de 2026.
- Autor del cambio: A2 (commits de `tumamagigante20`; PR #4 abierto por `Bastian13U`).
- Revisor: Claude Code en función de A3 (tester de A2), por instrucción explícita de la usuaria del proyecto, porque el agente A3 no pudo continuar. No es el agente A3 original.
- Referencia exacta revisada: `5f4f6df3e4b7522f6e48a5eed2e5698229f71249`, rama `task/T201`, PR #4. Base `98ffec73e2d81adfc136168ab0330d9441bd1ac9`; código en `d65d3f78789c2433c38cef16f76885b946193754`.
- Tarea y reporte revisados: `agents/tasks/T201.md`; `agents/reports/T201-A2-attempt-01.md`.
- Veredicto: APPROVED.

## Independencia

La misma sesión de Claude emitió también la auditoría obligatoria de T201 (`agents/reviews/T201-CLAUDE-5f4f6df3e4b7522f6e48a5eed2e5698229f71249-attempt-01.md`, rama `audit/T201-5f4f6df3e4b7522f6e48a5eed2e5698229f71249`). Esta revisión y esa auditoría no son dos opiniones independientes. Se registra según la regla 18 de `AGENTS.md`, porque la usuaria lo pidió explícitamente. Producción debe tenerlo en cuenta y puede pedir una revisión adicional de A3 cuando el agente esté disponible.

## Evidencia

Lectura: `agents/instructions/03-analisis-calidad.md` (función de tester de A2), ficha T201, contrato v1, `docs/experiencia-educativa.md`, `docs/calidad-y-despliegue.md` y el diff completo `98ffec7..5f4f6df`. Todos los archivos cambiados están en el alcance de la ficha; no hay cambios de contratos, dependencias ni configuración compartida.

Controles ejecutados en un clon aislado de `5f4f6df` (Windows 11, Node 22.12.0, npm 10.9.0, Playwright 1.64.1 con Chromium): `npm ci`, `npm run lint`, `npm run typecheck`, `npm test -- --run` con 30 pruebas, `npm run build`, `npm run test:e2e` y `npx vitest run --config tests/ui/browser.config.ts` con 2 recorridos; todos aprobados. Detalle en el reporte de auditoría citado.

Pruebas propias de tester, con un script de Playwright fuera del producto contra `vite preview` del build, a 360 px:

| Comprobación | Resultado |
| --- | --- |
| Solicitudes a servicios externos tras cargar | Ninguna; todas las peticiones van al origen local. |
| Errores de consola | Ninguno. |
| Semilla 0 | Válida (`aria-invalid="false"`). |
| Semilla al cambiar otro control | Se conserva (0 tras cambiar el ruido a 5000). |
| Período 0.5 | Error textual en el campo, no sólo color. |
| Contraste del texto de error sobre fondo | 8.15:1 |
| Contraste del texto general | 14.94:1 |
| Contraste del botón | 10.75:1 |
| Regiones anunciables | 6 (cinco errores con `aria-live="polite"` y un `role="status"`). |
| Jerarquía de encabezados | Un `h1`, cinco `h2` en el orden de `docs/experiencia-educativa.md` y tres `h3` de apoyo. |
| Animaciones activas con movimiento reducido | Ninguna; T201 no tiene animación. |
| Desplazamiento horizontal a 320, 360 y 768 px | Ninguno. |

Criterios de `docs/calidad-y-despliegue.md` que pertenecen a tareas posteriores y no se exigen aquí: pausa, reloj compartido entre curva y animación, ruido idéntico al pausar e invalidación de resultados al cambiar parámetros (T202 y T401).

No ejecutado: lector de pantalla real, zoom nativo del navegador y navegadores distintos de Chromium.

## Hallazgos

Ninguno bloqueante.

- R1, baja, `src/components/ScenarioControls.tsx:27`. Reproducción: en el campo de período, borrar el valor y teclear `abc`. Esperado: un mensaje que indique que el valor no es numérico. Observado: Chromium deja el valor del `input type="number"` vacío y se muestra «Introduce un valor; el campo no puede quedar vacío.», aunque la persona sí escribió algo. Impacto: mensaje algo confuso, sin riesgo de datos inválidos. Acción: opcional; puede atenderse en una tarea posterior de interfaz.
- R2, baja. `tests/ui/controls.check.ts` no se ejecuta en `npm test` ni en la CI, así que las comprobaciones de teclado y 360 px no detectarán regresiones automáticamente. Incorporarla exige tocar configuración compartida, fuera del alcance de T201. Acción: decisión de producción para una ficha posterior.

## Revalidación y cierre

Primer intento. Cualquier commit nuevo en `task/T201` que cambie código, pruebas, configuración o dependencias invalida esta revisión. El productor decide integración y DONE. El revisor se detiene al entregar.

## Gate adicional de Claude

Esta revisión especializada no sustituye el reporte obligatorio de Claude Code; ese reporte existe por separado. Como ambos los redactó Claude, producción debe considerar la observación de independencia de arriba antes de integrar.
