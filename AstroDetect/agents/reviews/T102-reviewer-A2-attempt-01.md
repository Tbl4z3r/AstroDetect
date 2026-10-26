# Revisión T102 — A2 — Intento 01

- Fecha: 26 de octubre de 2026.
- Autor del cambio: A1 (Tbl4z3r).
- Revisor: Claude Code en función de A2, por instrucción explícita de la usuaria del proyecto, porque el agente A2 no está disponible. No es el agente A2 original.
- Referencia exacta revisada: `a78f6708e20b1fb01df4e6ad5bc89b39465e14fe`, rama `task/T102`, PR #9. Base `75aa53e7d1d5e184d8066905f1f9396f2749f0b6`; código en `12dd63f12c28eab01e7b630fdc733735f5fb972d`.
- Tarea y reporte revisados: `agents/tasks/T102.md`; `agents/reports/T102-A1-attempt-01.md`.
- Veredicto: APPROVED.

## Independencia

La misma sesión de Claude emitió la auditoría obligatoria de T102 (`agents/reviews/T102-CLAUDE-a78f6708e20b1fb01df4e6ad5bc89b39465e14fe-attempt-01.md`, rama `audit/T102-a78f6708e20b1fb01df4e6ad5bc89b39465e14fe`). Esta revisión y esa auditoría no son dos opiniones independientes. Se registra según la regla 18 de `AGENTS.md`, porque la usuaria lo pidió explícitamente; producción puede pedir otra revisión de A2 cuando el agente esté disponible.

## Evidencia

Lectura, en el orden de `agents/instructions/02-interfaz.md`: contrato v1 y modelo de ruido, `docs/modelo-cientifico.md` y `docs/experiencia-educativa.md`; después el diff completo `75aa53e..a78f670` y las dos suites nuevas. Controles en clon aislado (`npm ci`, lint, typecheck, 164 pruebas, build, e2e) aprobados; el detalle y el oráculo completo de las 5001 muestras en cinco escenarios están en el reporte de auditoría citado.

Comprobaciones propias de A2 como futuro consumidor del motor en T202, con `src/simulation` compilado fuera del producto:

| Comprobación | Resultado |
| --- | --- |
| Sincronización: para cada muestra, `cleanFlux < 1` coincide con planeta delante y solapando el disco según `positionAt` en el mismo tiempo | 0 discrepancias en 5001 muestras. |
| Ocultación trasera | Toda muestra con planeta detrás tiene `cleanFlux` exactamente 1. |
| Reproducibilidad para la interfaz | Dos llamadas con la misma entrada dan observados idénticos bit a bit; con semilla 43 cambian las 5001 muestras. |
| Coherencia del ruido con lo que mostrará la UI | Residuos normalizados por sigma con 1000 ppm: media entre −0.014 y 0.008 y desviación entre 0.991 y 1.020 para semillas 0, 1, 42 y 4294967295, compatibles con normal estándar. |
| Coste de regenerar al confirmar parámetros | 5.6 ms por `simulate` en este equipo (media de 20). Regenerar al confirmar un cambio no bloqueará la interfaz. |
| Unidades | Tiempos en días, flujos adimensionales relativos a la estrella sin ocultar, `cadenceDays` = P/1000 y `durationDays` = 5P, como necesita el eje «Tiempo (días)». |
| Detector | `simulate` no llama a ningún detector; la separación de `observedFlux` para el detector queda a cargo del adaptador de T401, como fija el contrato. |

## Hallazgos

Ninguno que requiera cambios.

Observación para T202, sin acción para A1: la animación debe recorrer las muestras de `simulate` (o consultar `positionAt` con esos mismos `timeDays`) y no generar ruido por cuadro; la serie ya trae el tiempo compartido que exige `docs/experiencia-educativa.md`.

## Revalidación y cierre

Primer intento. Cualquier commit nuevo en `task/T102` que cambie código, pruebas, configuración o dependencias invalida esta revisión. El productor decide integración y DONE. El revisor se detiene al entregar.

## Gate adicional de Claude

Esta revisión especializada no sustituye el reporte obligatorio de Claude Code; ese reporte existe por separado. Como ambos los redactó Claude, producción debe considerar la observación de independencia de arriba antes de integrar.
