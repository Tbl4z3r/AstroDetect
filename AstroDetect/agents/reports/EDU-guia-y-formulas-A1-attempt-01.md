# Orientación educativa, guía y fórmulas — A1 — Intento 01

- Fecha, tarea y versión: 2 de noviembre de 2026, América/Santiago. Encargo directo del usuario en esta conversación: reforzar contenidos de astronomía con álgebra, guía de orientación, cálculos visibles del experimento y recuperación de la identidad espacial. Sin ID nuevo en backlog; no se inicia T405.
- Estado sugerido: DELIVERED.
- Autor y persona asignada: A1 por asignación expresa del usuario; implementación de interfaz y revisión de sus explicaciones matemáticas dentro de este encargo.
- Base y rama: develop, referencia remota verificada `25a3276901066cf8ed46064810924d1368033008`. QA y main coincidían con esa referencia; production permanecía en `ba6d4513d58411ef3859be997b728d9416040f90`.
- Referencia del código: [`830f8470206f88da5837bd6b705e1b37150ac879`](https://github.com/Tbl4z3r/AstroDetect/commit/830f8470206f88da5837bd6b705e1b37150ac879).
- Reportes previos: [integración del cuaderno orbital](UX-cuaderno-orbital-A1-attempt-01.md) y [QA del prototipo anterior](QA-cuaderno-orbital-2026-11-02-attempt-01.md).
- Contratos y dependencias: contratos y modelo v1 conservados. Leídos AGENTS, README, colaboración, ramas, asignaciones, backlog, instrucciones de interfaz, contratos, modelo científico, experiencia educativa, informe y plantilla de reporte. El PDF aportado por el usuario coincide con `docs/informe/informe.pdf`; se contrastó su contenido con el código actual. No se modifican motores, contratos, dependencias, configuración, versiones ni registro compartido.

## Alcance realizado

Se recupera el fondo espacial con estrellas y gradientes morados y azules oscuros. El encabezado conserva AstroDetect sin la etiqueta de cuaderno, y sitúa «Del movimiento a la evidencia» con una descripción referida a tránsitos en el espacio central. Se retiran las etiquetas superiores «Simulación educativa», «Una estrella · un planeta», «La luz guarda una pista», «Una órbita, dos miradas», «Mismo sistema · mismo tiempo» y la instrucción «Cambia una variable. Predice su efecto». La simulación dispone de un encuadre mayor; conserva el nombre accesible «Simulación orbital» y las identificaciones de ambas perspectivas.

El botón visible «Guía» abre un recorrido voluntario de 12 pasos. Oscurece la página, destaca un elemento y presenta una explicación breve: radios, período, ruido, semilla, referencia, cámara, observador, reloj, curva, detector y navegación. Tiene anterior/siguiente, cierre, finalización y Escape. Conserva el foco dentro del diálogo y lo devuelve al botón al cerrar. Abre temporalmente la configuración móvil y vuelve a la vista y estado de panel anteriores. Pausa la reproducción y el renderizado orbital durante el recorrido; no cambia parámetros, mediciones ni resultados. Cuando una entrada inválida retira un elemento, la guía lo explica y permite continuar o salir.

«Entender» explica ocho bloques sobre el escenario vigente: tránsito, flujo normalizado, áreas y radios, Kepler, fase y superposición, duración física, muestreo/ruido y reglas de detección/repetición. Ofrece sustituciones con unidades y detalles desplegables; retira las sustituciones del escenario anterior cuando la configuración es inválida. La masa estelar se muestra como dato fijo de una masa solar. No se añade un control de masa ni de inclinación.

La tabla opcional muestra las mismas 5.001 muestras internas de la curva en páginas de 20 filas: tiempo, flujo ideal, observado y ruido añadido. Permite ir a la muestra próxima al cursor y localizar una fila en la curva, conservando la serie y el análisis. Sus números se redondean para presentación, y los valores positivos diminutos usan notación científica. No hay importación de datos, cuentas ni integración externa. La tabla cerrada y la explicación oculta no generan sus árboles de contenido durante la reproducción.

Archivos de producto: `src/app/App.tsx`; `src/components/GuidedTour.tsx`, `MeasurementTable.tsx`, `experimentMath.ts`, `ScienceGuide.tsx`, `ModelReference.tsx`, `LightCurve.tsx`, `PlaybackControls.tsx` y `ScenarioControls.tsx`; `src/styles/laboratory.css`.

Pruebas: nuevos `tests/e2e/guide.spec.ts`, `learning.spec.ts` y `tests/ui/experiment-math.test.tsx`; adaptación de `tests/e2e/smoke.spec.ts`, `tests/ui/structure.test.tsx` y `controls.check.ts` a las etiquetas expresamente retiradas. Se conservan las verificaciones científicas y de comportamiento anteriores.

## Correspondencia de las fórmulas

Se revisaron `geometry`, `orbit`, `flux`, `simulate`, `random`, `validation`, el detector y su adaptador frente al contrato y al modelo documentado. No se encontró una discrepancia que exigiera cambiar sus algoritmos en este encargo. La comprobación es sobre el modelo circular central adoptado, no una afirmación de realismo completo.

| Concepto explicado | Correspondencia y límite |
|---|---|
| Unidades y Kepler | Radios nominales convertidos a metros; P convertido a segundos; a = raíz cúbica de μP²/(4π²). Se reutiliza `semiMajorAxisMetres`, con μ solar nominal y masa planetaria despreciada. a es distancia entre centros en una órbita circular, no distancia a la Tierra. |
| Fase y observación | t0=P/2; x=a sen θ y delante sólo en la mitad apropiada de la órbita. El motor reduce la fase por período; evita una caída artificial cuando el planeta está detrás. La cámara 3D no altera el observador de la curva. |
| Flujo y áreas | f=F/F0; frente al disco, f=1−A/(πR²). Se explican discos separados, planeta contenido y superposición parcial. δ=(Rp/Rstar)² es la caída central de estrella uniforme. El dato central presentado se obtiene de `fluxAt`, sin otro simulador de flujo. |
| Inversión de radio | Rp=Rstar√δ se enseña bajo los mismos supuestos y exige conocer Rstar. No se infieren ambos radios absolutos, luminosidad, magnitud astronómica ni masa planetaria de una sola curva normalizada. |
| Duración física | Se añade a la presentación T14=(P/π)arcsen[(Rstar+Rp)/a], en días; se convierte a horas para mostrarla. Es el único cálculo físico derivado nuevo de esta capa y se verifica con contactos de referencia independientes. No reemplaza el tramo bajo umbral del detector. |
| Muestreo y ruido | 5P, 5.000 intervalos y 5.001 muestras; cadencia P/1000. Observado=limpio+σZ, con σ=noisePpm×10⁻⁶. Se explica semilla, Box–Muller y convención de cero; no se regenera ruido por cuadro ni se recorta el flujo observado. |
| Detector | b=mediana de flujo observado; MAD=mediana de desviaciones absolutas; s=max(1,4826MAD,piso); umbral=b−4s. Se explica que s no es la σ configurada. Al menos tres muestras estrictamente bajo umbral; profundidad=base−mediana del grupo y centro=punto medio de sus extremos. No se replica el detector en la interfaz. |
| Período estimado | Mediana de separaciones entre centros, con al menos tres eventos; debe superar dos cadencias y cumplir tolerancia max(2cadencias,0,10P). Se muestran centros, resultado y tolerancia de la última búsqueda. Para la serie interna uniforme la cadencia del escenario coincide con la mediana de cadencias utilizada por el detector. |

Fuentes educativas contrastadas y enlazadas en la interfaz: [NASA, qué es un tránsito](https://science.nasa.gov/exoplanets/whats-a-transit/), [NASA, órbitas y Kepler](https://science.nasa.gov/solar-system/orbits-and-keplers-laws/) y [NASA, información de la curva de tránsito](https://science.nasa.gov/resource/light-curve-of-a-planet-transiting-its-star/), consultadas el 2 de noviembre de 2026. Las especificaciones numéricas y estadísticas concretas son las del modelo y código del proyecto.

## Verificaciones propias

Entorno: Windows, Node 22.12.0, npm 10.9.0, Chromium de Playwright 1.64.1. Vista previa local compilada en `http://127.0.0.1:4182/AstroDetect/`; los E2E levantan su preview aislado en 4173.

| Comprobación | Resultado ejecutado |
|---|---|
| npm run lint | Aprobado; incluye ausencia de comentarios, docstrings y TODO de código |
| npm run typecheck | Aprobado; repetido también por build |
| npm test -- --run | 16 archivos, 230 pruebas aprobadas |
| npm run build | Aprobado; 46 módulos; bundle principal aproximadamente 287 kB y chunk 3D diferido aproximadamente 512 kB |
| npx vitest run --config tests/ui/browser.config.ts | 3 archivos, 7 recorridos aprobados |
| npm run test:e2e | 13 recorridos aprobados; última ejecución completa 26,7 s |
| QA de guía | 24 comprobaciones de colocación: 12 pasos en 320×640 y 12 en 1280×900; captions dentro del viewport, sin superposición con el área destacada; sin errores JavaScript |
| QA visual complementaria | 5 comprobaciones aprobadas: escritorio, Entender con P=10 y planeta=5, móvil360, cambio de tamaño con guía abierta e inválidos/Escape |
| git diff --check | Aprobado |

Las seis pruebas nuevas de cantidades y explicaciones usan referencias independientes: 432.000 s, distancia orbital 8.560.644.525,098671 m, caída 0,008405017877225196 y contactos 2,429307726766928/2,570692273233072 días para el escenario inicial. Comprueban relaciones de área y Kepler, finitud en 32 combinaciones de extremos, escenario vigente, retirada de datos inválidos y diferencia entre cero y ruido diminuto. Los nuevos E2E comprueban datos invariables durante la guía, foco y Escape, navegación de muestras y correspondencia de los cálculos/detección con parámetros modificados.

Incidencias reales y resolución:

- La primera ejecución completa encontró un fallo de foco en el diálogo móvil: Tab podía salir del contenido al llegar al extremo. Se añadió contención explícita en ambos sentidos y pruebas con Tab y Shift+Tab; las repeticiones pasaron.
- Una comprobación visual externa esperaba una etiqueta distinta de la que se muestra para masa estelar. Se corrigió el selector del arnés y se comprobó el dato real; no se cambió el producto para satisfacer esa expectativa.
- El acceso automatizado al navegador lateral devolvió «browser.user is unavailable». La comprobación visual se realizó con capturas del Chromium de pruebas local, que se inspeccionaron directamente. No se afirma una comprobación interactiva del navegador lateral.
- Un intento de iniciar otro servidor en 4182 confirmó que la vista previa anterior seguía activa; se utilizó esa misma vista previa sobre la compilación nueva, sin cerrar procesos ajenos.

Tras la ronda completa se aclararon tres separadores tipográficos de ecuaciones y se repitieron lint, las 230 pruebas y build. Los motores y la conducta comprobada no cambiaron. Se conserva la advertencia conocida del chunk 3D mayor que 500 kB. No se reinstalaron ni actualizaron dependencias locales, pues el lockfile no cambió; `npm ci` se ejecuta en CI al publicar. Los avisos de herramientas de desarrollo registrados en el reporte QA anterior quedan fuera de esta entrega y no se declaran resueltos.

Evidencia propia: [EDU-guia-2026-11-02](../evidence/EDU-guia-2026-11-02/), con capturas de laboratorio, móvil, Entender y guía; resultados geométricos del recorrido, comprobaciones visuales y medición de diez contextos. Los archivos históricos T401/T402 que las pruebas regeneran fueron restaurados a su contenido previo; no forman parte del commit.

## Límites y continuidad

Se entrega únicamente en develop. Esta asignación no autoriza una nueva promoción a QA, main o production; la candidata anterior de main conserva su revisión pendiente por el usuario. No se publica la web ni se envían mensajes a Claude. El registro compartido permanece intacto y no se declara DONE.

La masa de una masa solar es un supuesto visible, no una medida de la estrella configurada. La inclinación sigue fija y no se incorpora física adicional. No hay integración de datos externos ni una hoja de cálculo profesional. La navegación de datos es una herramienta educativa sobre la serie interna.

Las pruebas ejecutadas corresponden a Chromium local y, después de publicar, CI. No se certifican otros navegadores, lectores de pantalla, eficacia pedagógica con estudiantes ni capacidad máxima del sitio público. Las capturas son locales. Claude puede contrastar este reporte, las fórmulas y sus pruebas antes de la siguiente decisión de integración.

Para revertir la entrega, preparar un commit nuevo en develop que revierta la referencia de código indicada, comprobarlo y seguir el protocolo de ramas, conservando historial y reportes.
