# QA estelar — A1 — Intento 01 rechazado

- Fecha y encargo: 2 de noviembre de 2026, América/Santiago. Prueba intensiva solicitada por el usuario, corrección del signo de Guía y publicación en qa para revisión posterior de Claude.
- Dictamen: NO APTA para la entrega final; se cierra esta ronda de tester con dos defectos confirmados. La instrucción del usuario autoriza corregir en develop y repetir QA. No se promueve main ni production.
- Autor: A1, rol temporal de tester de producto.
- Base y candidata: `e87263e2b0d6055340254ad84fa25d18bf8bc06d`, incorporada a qa por avance rápido. Main permanece en `b86ed2613d1d8f1389e4adada6b248be5e3a3a7d`; production en `ba6d4513d58411ef3859be997b728d9416040f90`.
- Código original: `8f81f9fa3165e3fc1253e7e834a23cfd26f7c551`; [reporte de entrega](STARS-A1-attempt-01.md).
- Contratos, dependencias y configuración: sin cambios durante la ronda.

## Verificaciones terminadas al emitir este rechazo

Windows, Node22.12.0, npm10.9.0 y Chromium. npm ci instaló197 paquetes y auditó198 en aproximadamente un minuto. Lint y tipos aprobados; 17 archivos/318 pruebas unitarias aprobados en2,47s; build47 módulos en488ms; 7 recorridos UI aprobados en21,47s. E2E inicial:21/22 aprobados, un timeout al esperar durante5s la cámara de la primera escena3D. Repetida aisladamente con el mismo límite, esa prueba pasó; no se atribuye por sí sola a un fallo de recuperación. No se desactiva ni amplía una validación.

La matriz de guía terminó13/13 recorridos y6/6 escenarios de tamaño/desplazamiento, cero errores JavaScript:180px, texto200% emulado,12pasos,20reaperturas, teclado, restauración, offline y escena visible durante Guía. La primera agrupación adversarial terminó64/64 extremos válidos, incluidos5.001 puntos, fase, periodicidad, profundidad y distancia con expectativas independientes. Las agrupaciones interiores e inválidos continúan sobre la misma compilación inalterada; este reporte no las declara aprobadas antes de su término. Sus resultados completos deben figurar en la ronda siguiente.

npm audit --omit=dev --json: cero avisos de ejecución. Permanecen11 avisos moderados de herramientas de desarrollo y la advertencia conocida de tamaño del módulo3D; no se cambian dependencias.

## Defectos confirmados

- QA-STARS-01, presentación: el signo de pregunta se dibuja2,25px por debajo del centro del círculo en la captura DPR2, frente a una tolerancia visual de0,75px. Reproduce la observación del usuario. La captura del botón y la medida de píxeles están en evidencia. Se requiere sustituir el carácter dependiente de métricas tipográficas por un icono centrado, manteniendo el nombre accesible Guía.
- QA-STARS-02, recursos gráficos: alternar masa vacía y válida40veces recupera la escena y conserva el detector, pero produce25 avisos de exceso de contextos WebGL; el navegador tiene que perder los más antiguos. La liberación actual de recursos no libera explícitamente el contexto gráfico del canvas retirado. Una nueva regresión de24recuperaciones reprodujo9avisos y falló; las otras dos pruebas aisladas pasaron (3pruebas,31,7s). Debe liberarse el contexto al desmontar, conservando la recuperación normal de una pérdida temporal de la escena vigente.

La navegación de tabla35páginas hacia delante y35hacia atrás terminó correctamente, sin índices fuera de rango. No hubo errores de página en esa matriz. Una versión inicial del arnés adversarial se interrumpió por hacer una aserción por cada vértice: se conservó como ejecución sin resultado; la optimización mantiene todos los puntos y tolerancias y comprueba su error máximo por escenario.

## Evidencia y continuidad

[Evidencia del intento](../evidence/QA-STARS-2026-11-02/attempt-01/) contiene captura y medidas del icono, avisos de contexto y matrices terminadas. Las pruebas son acotadas a Chromium local y no certifican todos los dispositivos ni capacidad pública. Se termina aquí el rol de tester de esta ronda. Corregir en develop, publicar una nueva candidata en qa y repetir los controles antes de entregar. No se actualiza backlog ni se declara DONE.
