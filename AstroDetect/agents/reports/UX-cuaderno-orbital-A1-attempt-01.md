# Integración del cuaderno orbital — A1 — Intento 01

- Fecha, tarea y versión: 28 de octubre de 2026; integración UX/UI del prototipo por asignación directa del usuario en esta sesión. La solicitud no tiene un ID nuevo en backlog; no se inventa una ficha ni se toma T405. Se conserva la versión existente del paquete.
- Estado sugerido: DELIVERED.
- Autor y persona asignada: A1, por encargo directo de integración de interfaz.
- Base y rama: develop, base remota verificada `ba6d4513d58411ef3859be997b728d9416040f90`.
- Referencia de código: [`50ae38f67f4325664654b7cb4990f3a8cff855b4`](https://github.com/Tbl4z3r/AstroDetect/commit/50ae38f67f4325664654b7cb4990f3a8cff855b4).
- Reporte previo: no existe una entrega anterior de esta integración. El prototipo independiente y su comparación fueron preparados en esta conversación.
- Contratos y dependencias: contratos v1 y motores actuales de simulación y análisis; dependencias de instalación fijadas sin cambios. Se consultaron AGENTS de raíz y aplicación, README, colaboración, ramas, contratos, instrucciones de interfaz, asignaciones y backlog remotos.

## Alcance realizado

Se integra la experiencia como un cuaderno orbital con tres vistas: Observar, Entender y Experimentar. La composición utiliza una superficie clara, acentos verdes, navegación numerada y una escena nocturna contenida. Los controles quedan junto a la escena, la curva y los resultados en escritorio; en móvil se abren con un control plegable. Esta adaptación da una identidad propia a AstroDetect sin copiar recursos, textos o código de Foster.

El laboratorio conserva un solo reloj, las 5.001 mediciones, la semilla y el análisis al cambiar de vista. Los cambios de parámetros válidos o inválidos retiran resultados anteriores y vuelven al inicio en pausa. Los experimentos preparan escenarios conocidos de tamaño, ruido y período y delegan sus cálculos al motor existente. No se implementa un caso desconocido.

La guía explica flujo normalizado, profundidad, Kepler, muestreo y límites de la detección. La referencia numérica del escenario se distingue del resultado del detector. Las mediciones individuales se despliegan a petición del usuario. La curva conserva todas las muestras y ajusta el lienzo SVG al ancho disponible, con etiquetas en píxeles legibles.

El 3D permanece en Three.js. Se añaden controles de cámara por teclado, se declara la ampliación visual de planetas pequeños y se ajusta su relación de aspecto al contenedor. Girar la cámara no cambia la línea de visión física. El bucle de render se pausa al abrir otra vista o al quedar la escena fuera de pantalla. La vista del observador y la curva conservan sus motores.

Archivos de producción:

- src/app/App.tsx.
- src/components/ScenarioControls.tsx, PlaybackControls.tsx, DetectionPanel.tsx y LightCurve.tsx.
- src/components/Orbit3D.tsx, orbitScene.ts y orbitPresentation.ts.
- src/components/ScienceGuide.tsx, LearningExperiments.tsx y ModelReference.tsx.
- src/styles/laboratory.css.

Verificación:

- tests/ui/structure.test.tsx, synchronized.test.tsx y orbit-presentation.test.tsx.
- tests/ui/controls.check.ts, synchronized.check.ts y detection.check.ts.
- tests/e2e/acceptance.spec.ts y workspace.spec.ts.
- Este reporte y [evidencia propia](../evidence/UX-prototipo/verification.json), con capturas de escritorio, medición y móvil en esa misma carpeta.

No cambian src/simulation, src/analysis, src/contracts, dependencias, workflows, configuración compartida ni registro de tareas. Los archivos históricos T401/T402 reescritos por las pruebas se restauraron a su estado de base; no forman parte de la entrega.

## Verificaciones propias

Entorno: Windows, PowerShell, Node 22.12.0, npm 10.9.0 y Chromium de Playwright 1.64.1.

| Verificación | Resultado final |
|---|---|
| npm ci | 197 paquetes instalados; 198 auditados; cero vulnerabilidades informadas |
| npm run lint | Aprobado; incluye comprobación de ausencia de comentarios de código |
| npm run typecheck | Aprobado; también se ejecuta al compilar |
| npm test -- --run | 15 archivos, 224 pruebas aprobadas |
| npm run build | Aprobado; 43 módulos; carga diferida del 3D |
| npx vitest run --config tests/ui/browser.config.ts | 3 archivos, 7 recorridos aprobados |
| npm run test:e2e | 6 recorridos aprobados, incluida la prueba de diez contextos independientes; ejecución final de 9,0 s |
| git diff --check | Aprobado |

Se comprobó manualmente la interfaz local, la detección de cinco eventos y período de cinco días, conservación de la curva al girar la cámara, preparación de un caso ruidoso sin evidencia y disposición móvil de 360 píxeles sin desbordamiento horizontal. La consola de esa comprobación no mostró errores.

Resultados intermedios y correcciones:

1. La primera ejecución de la prueba de descubrimiento de Vitest falló por permisos al escribir su token en el directorio temporal del entorno restringido. La ejecución con acceso apropiado pasó; no se cambió esa prueba ni la configuración.
2. Una repetición del recorrido de diez contextos agotó los 30 segundos. Se añadió la pausa del 3D fuera de pantalla, además de la pausa por vista oculta. La repetición final completa pasó; el recorrido concurrente terminó en 3,1 segundos. No se aumentó su límite ni se redujo la concurrencia.
3. El recorrido largo de validación de controles agotó el límite implícito de cinco segundos en una ejecución. Se le asignó, junto al recorrido de teclado de ese archivo, el mismo presupuesto explícito de 30 segundos utilizado por los demás recorridos de Chromium. Se conservan las comprobaciones de todos los límites, entradas inválidas, foco, deslizadores y teclado. La ejecución final de los siete recorridos pasó en 7,92 segundos.

El build mantiene la advertencia conocida del chunk de Three.js de aproximadamente 512 kB, cargado de forma diferida. La instalación avisa de la antigüedad de la versión de ESLint fijada por el proyecto. No se alteran las dependencias ni se desactivan advertencias.

La CI remota se consultará tras publicar el commit en develop; este reporte registra los resultados locales realmente ejecutados.

## Límites y continuidad

La entrega corresponde a develop según el protocolo del 28 de octubre. No se crean ramas por tarea. Sólo se publican los commits propios; no se promueve a qa, main o production ni se activa un despliegue.

Producción puede asignar el identificador de seguimiento de este encargo, seleccionar la candidata de develop, promoverla a QA y registrar sus controles sobre el commit exacto antes de continuar a main y production. El autor propone DELIVERED y se detiene.

Las capturas muestran una vista previa local, no una nueva publicación pública. La propuesta no está evaluada con estudiantes ni constituye una certificación completa de accesibilidad. El modelo científico conserva sus simplificaciones previas.

Para revertir esta interfaz, preparar en develop un commit nuevo que revierta la referencia de código indicada y volver a comprobar la candidata siguiendo el mismo recorrido de ramas, sin reescribir el historial.
