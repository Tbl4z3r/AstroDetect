# Revisión T101 — A2 — Intento 01

- Fecha: 26 de octubre de 2026.
- Autor del cambio: A1 (Tbl4z3r).
- Revisor: Claude Code en función de A2, por instrucción explícita de la usuaria del proyecto, porque el agente A2 no pudo continuar. No es el agente A2 original.
- Referencia exacta revisada: `e7a9bca8226f9fc726aba6563cf6f1078a635445`, rama `task/T101`, PR #3. Base `98ffec73e2d81adfc136168ab0330d9441bd1ac9`; código en `88e24ca70489f7743d76110bc411301803658e43`.
- Tarea y reporte revisados: `agents/tasks/T101.md`; `agents/reports/T101-A1-attempt-01.md`.
- Veredicto: APPROVED.

## Independencia

La misma sesión de Claude emitió también la auditoría obligatoria de T101 (`agents/reviews/T101-CLAUDE-e7a9bca8226f9fc726aba6563cf6f1078a635445-attempt-01.md`, rama `audit/T101-e7a9bca8226f9fc726aba6563cf6f1078a635445`). Por eso esta revisión y esa auditoría no son dos opiniones independientes: ambas proceden del mismo revisor. Se registra según la regla 18 de `AGENTS.md`, porque la usuaria lo pidió explícitamente. Producción debe tenerlo en cuenta y puede pedir una revisión adicional de A2 cuando el agente esté disponible.

## Evidencia

Lectura, en el orden de `agents/instructions/02-interfaz.md`: contrato `docs/contratos.md` v1 y `src/contracts/index.ts` 1.0.0, `docs/modelo-cientifico.md` y `docs/experiencia-educativa.md`; después el diff completo `98ffec7..e7a9bca` y las tres suites de prueba. El cambio sólo añade archivos dentro del alcance de la ficha.

Verificaciones ejecutadas en un clon aislado de `e7a9bca` (Windows 11, Node 22.12.0, npm 10.9.0): `npm ci`, `npm run lint`, `npm run typecheck`, `npm test -- --run` con 104 pruebas, `npm run build` y `npm run test:e2e`, todos aprobados; las salidas y cifras detalladas están en el reporte de auditoría citado.

Comprobaciones propias de la función de revisor de A2:

- Unidades y límites: tiempos públicos en días; semieje en metros a partir del período en segundos; `xOverStarRadius` adimensional relativo al radio estelar. Límites inclusivos importados de `SCENARIO_LIMITS` sin copias locales.
- Ocultación trasera: barrido fuera del producto, compilando `src/simulation` con `tsc`, de 36 escenarios (radio estelar 0.5, 1 y 2; radio planetario 1, 10 y 20; período 1, 5, 13.7 y 30 días) con las 5001 muestras del contrato, 180036 evaluaciones. Cuando `inFront` es falso el flujo es exactamente 1; hay cinco tránsitos por serie; la profundidad en los cinco centros coincide con (r/R)² a 1e-10; ningún valor es NaN, infinito ni sale de [0, 1].
- Continuidad: en ese barrido el salto máximo entre muestras consecutivas nunca supera la profundidad (r/R)², es decir, no hay caídas rectangulares ni discontinuidades fuera del ingreso y egreso.
- Sincronización temporal: `positionAt` y `fluxAt` derivan la fase del mismo cálculo (`flux.ts:7` llama a `positionAt`), así que la animación y la curva coincidirán si consultan el mismo tiempo. En cuadratura `xOverStarRadius` es igual a a/R. Durante el tránsito el planeta avanza de x negativo a x positivo, convención estable para dibujar.
- Consumo sin interfaz: las funciones son puras, sin DOM, React, red ni estado global; sólo importan `../contracts` y módulos propios. El escenario congelado no se muta.
- Detector: el cambio no añade detector ni expone verdad simulada a ningún consumidor.

## Hallazgos

Ninguno que requiera cambios.

Observaciones para tareas consumidoras, sin acción solicitada a A1:

- `positionAt` y `fluxAt` lanzan RangeError si el escenario no es válido. La interfaz de T202 debe validar con `validateScenario` antes de consultarlas, como exige el contrato, y no llamarlas mientras un control tenga una entrada inválida.
- Ambas funciones revalidan el escenario en cada llamada. Para animación a 60 cuadros por segundo el coste es pequeño, pero T202 puede reutilizar la serie de `simulate` (T102) en lugar de recalcular flujo por cuadro.

## Revalidación y cierre

Primer intento. Cualquier commit nuevo en `task/T101` que cambie código, pruebas, configuración o dependencias invalida esta revisión. El productor decide integración y DONE. El revisor se detiene al entregar.

## Gate adicional de Claude

Esta revisión especializada no sustituye el reporte obligatorio de Claude Code; ese reporte existe por separado. Como ambos los redactó Claude, producción debe considerar la observación de independencia de arriba antes de integrar.
