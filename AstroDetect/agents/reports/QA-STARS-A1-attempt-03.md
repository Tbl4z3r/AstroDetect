# QA intensiva de la página y modelos estelares — A1 — Intento 03

- Fecha, tarea y versión: 2 de noviembre de 2026, América/Santiago. Encargo directo del usuario: probar intensivamente la página, corregir el signo de Guía y los fallos encontrados. Aclaración recibida: integrar a main después de aprobar QA, para revisión posterior de Claude. No se toma otra tarea del backlog.
- Estado sugerido: DELIVERED. Dictamen de producto: APTA para integrar qa a main; sin promoción a production.
- Autor: A1. Se conservan los rechazos y se separan las rondas de tester de sus correcciones.
- Base de main: `b86ed2613d1d8f1389e4adada6b248be5e3a3a7d`. Candidata inicial: `e87263e2b0d6055340254ad84fa25d18bf8bc06d`.
- Código probado en esta ronda: [`6acd474f63290d5bf5f6ab129107ab0787febedd`](https://github.com/Tbl4z3r/AstroDetect/commit/6acd474f63290d5bf5f6ab129107ab0787febedd), publicado en develop y qa. Corrección funcional y visual: `1d087ffc8b6b2a4908951b05d2d356fa80c16caf`.
- Reportes previos: [entrega estelar](STARS-A1-attempt-01.md), [rechazo 01](QA-STARS-A1-attempt-01-rejected.md), [rechazo 02](QA-STARS-A1-attempt-02-rejected.md).
- Contratos y dependencias: contrato/modelo 1.1.0 conservados durante QA. Sin cambios de fórmulas físicas, ruido, detector, dependencias, configuración compartida, versiones de release o registro. Reglas y referencias remotas consultadas antes de actuar; copia local sin cambios anteriores al encargo.

## Defectos y correcciones

QA-STARS-01: el carácter «?» quedaba 2,25 px por debajo del centro del círculo en una captura DPR2. Se reemplaza por un SVG de geometría centrada, sin dependencia de las métricas de la fuente y sin cambiar el nombre accesible «Guía». La misma medición sobre la corrección da +0,25 px horizontal y −0,25 px vertical, dentro de la tolerancia de 0,75 px. El SVG mantiene centrado su contenedor en DPR1 normal y con tamaño de texto emulado al 200 %, y se declara aria-hidden para no duplicar el nombre del botón. Se inspeccionaron ambas capturas.

QA-STARS-02: retirar y recuperar la escena por entradas inválidas liberaba sus materiales, pero dejaba contextos WebGL hasta que el navegador forzaba su pérdida. La prueba de 40 ciclos produjo 25 avisos y la regresión de 24 ciclos reprodujo 9. El desmontaje ahora llama también a la liberación del contexto, después de retirar listeners y recursos. La repetición de 40 ciclos dio cero avisos y cero errores, con serie y detector operativos. La prueba de pérdida temporal y restauración de la escena vigente sigue pasando; liberar un canvas retirado no elimina la recuperación de uno activo.

La CI de la segunda candidata también detectó una carrera en el arnés de teclado: el test pulsaba Tab antes de que el enlace de salto terminara su foco diferido al encabezado. Se añade una aserción de foco sobre el encabezado antes de Tab; se conservan las posteriores sobre selector, campo, teclado y errores. No se fuerza el foco, se amplían límites ni se retiran comprobaciones. [CI fallida conservada](https://github.com/Tbl4z3r/AstroDetect/actions/runs/41509816214); la nueva candidata pasa.

Archivos de esta corrección: `src/app/App.tsx`, `src/styles/laboratory.css`, `src/components/orbitScene.ts`, `tests/e2e/resilience.spec.ts` y `tests/e2e/acceptance.spec.ts`. Se agrega la regresión de liberación de contextos; el cambio visual se verifica con capturas y medidas, sin una prueba que sólo replique las coordenadas del SVG.

## Batería completa sobre 6acd474

Windows, Node 22.12.0, npm 10.9.0, Chromium de Playwright; compilación servida en 4182 y preview E2E independiente en 4173. Las matrices externas se iniciaron después de terminar la batería, sin cambiar la compilación mientras se ejecutaban.

| Control | Resultado real |
|---|---|
| npm ci | Aprobado: 197 paquetes instalados, 198 auditados, 14 s |
| npm run lint | Aprobado, incluido control de comentarios |
| npm run typecheck | Aprobado |
| npm test -- --run | 17 archivos, 318 pruebas aprobadas, 2,44 s |
| npm run build | Aprobado: 47 módulos, 453 ms |
| npx vitest run --config tests/ui/browser.config.ts | 3 archivos, 7 recorridos aprobados, 10,46 s |
| npm run test:e2e | 23 recorridos aprobados, 56,3 s, con cuatro workers y límites originales |
| Diez contextos concurrentes | Aprobados, 7.265 ms; cero errores de sesión |
| npm audit --omit=dev --json | Cero avisos de dependencias de ejecución |
| CI de qa para 6acd474 | [AstroDetect checks: success](https://github.com/Tbl4z3r/AstroDetect/actions/runs/41510304606), incluidos instalación limpia, lint, tipos, unitarias, build y E2E |

También se conservan los resultados no aprobados: la primera E2E dio 21/22 y un timeout de 5 s al iniciar una escena bajo carga; su repetición aislada pasó con el mismo límite. En la segunda ronda, UI dio 6/7 y un timeout de 30 s en el recorrido de reloj. La batería completa final, sin matrices externas concurrentes y sin cambiar esos límites, pasó 7/7 y 23/23. Los fallos de preparación y ejecución no se convierten retrospectivamente en aprobaciones ni se atribuyen sin prueba a la corrección gráfica.

## Pruebas intensivas adicionales sobre la misma candidata

La matriz adversarial terminó 6/6 grupos en unos 110 s, sin hallazgos ni errores de página:

- 64 combinaciones extremas válidas y 24 escenarios interiores de alta precisión; salida finita, 5.001 puntos, profundidad y distancia calculadas con constantes independientes, periodicidad en toda la curva, cinco centros delanteros y seis traseros.
- 30 entradas inválidas: conserva el texto introducido, señala el campo e invalida simulación y detección; la recuperación válida regenera datos coherentes.
- 40 selecciones rápidas de modelo estelar: conserva parámetros ajenos, reinicia reloj e invalida resultados anteriores.
- Última página y muestra 5001 con período 30, extremos del reloj y regreso al centro del tránsito.
- Configuraciones libres y aviso de resolución temporal insuficiente; el color no se interpreta como cambio del flujo físico.

La reproducción reforzada pasó 3/3 semillas: 0, 4294967295 y 19371501. Cambiar realmente a otra semilla modifica la curva; volver recupera exactamente la anterior. Reloj y detector conservan datos. La comprobación suplementaria sin SHA de la ronda anterior no se usa como prueba de esta candidata: se repitió con 6acd474.

La guía terminó 13/13 recorridos y 6/6 escenarios de redimensionamiento/desplazamiento; cero errores de página. Se verificaron sus 12 pasos, 20 reaperturas, Tab/ShiftTab/Escape, fondo inerte, conservación de datos, pausa, movimiento reducido, funcionamiento offline después de cargar y restauración desde las distintas vistas. Viewports: 180×700, 320×640, 360×800, 1280×900 y 640×320. El tamaño de texto al 200 % es emulado mediante estilos, no una certificación de zoom nativo ni lector de pantalla.

Se comprueba el objetivo DOM real, una región visible separada del caption, ausencia de solapamiento y scroll estable en tres muestras separadas por 500 ms. Capturas de escritorio y 320 px confirman estrella y órbita renderizadas durante la guía. Dos verificaciones adicionales del botón en DPR1 pasan; la alineación del contenedor respecto al botón difiere menos de 0,008 px.

La matriz de resistencia final pasa 3/3: medida del icono, 40 desmontajes y recuperaciones 3D, y navegación de tabla 35 páginas hacia delante y 35 hacia atrás, sin índices fuera de rango. No se registraron errores JavaScript ni avisos de exceso de contextos. El arnés adversarial inicial que se interrumpió por hacer una aserción por vértice se conserva fuera del repositorio como ejecución sin resultado; la versión optimizada comprueba los mismos puntos y tolerancias mediante su error máximo.

## Evidencia, límites y cierre

[Evidencia final](../evidence/QA-STARS-2026-11-02/attempt-03/) contiene matrices JSON, medidas, capturas y datos de concurrencia. [Intento 01](../evidence/QA-STARS-2026-11-02/attempt-01/) conserva el icono anterior y los avisos que justificaron el rechazo. Los archivos T401/T402 regenerados por pruebas se restauran a su contenido histórico antes del commit.

Permanecen los 11 avisos moderados conocidos de herramientas de desarrollo y el aviso de chunk 3D de unos 512 kB; esta QA no actualiza dependencias ni los declara resueltos. El alcance es Chromium local y CI Linux, con tamaños móviles simulados; no certifica Safari, Firefox, dispositivos físicos, accesibilidad integral ni capacidad pública ilimitada. «Prueba intensiva» describe las matrices ejecutadas, no la ausencia garantizada de cualquier defecto posible.

Se cierra el rol de tester con 6acd474 apta para main. El commit posterior añade sólo este reporte y evidencia: debe conservar el código probado y pasar CI en qa antes de integrarse por avance rápido, tras revalidar referencias y ascendencia. Luego se verifica la CI del commit en main. El usuario coordinará la revisión de Claude; no se le envían mensajes desde esta sesión. No se promueve production, despliega, modifica backlog ni declara DONE.
