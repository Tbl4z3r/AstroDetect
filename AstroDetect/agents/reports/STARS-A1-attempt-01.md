# Selector de modelos estelares — A1 — Intento 01

- Fecha, tarea y versión: 2 de noviembre de 2026, América/Santiago. Encargo directo del usuario: cambiar de estrella, comprender el impacto científico y comenzar con secuencia principal, explicando las compactas aparte. No se toma otro ID del backlog.
- Estado sugerido: DELIVERED; entrega de autor en develop, pendiente de promoción y QA de la candidata que seleccione producción.
- Autor y persona asignada: A1 por asignación expresa del usuario.
- Base y rama: develop desde `b86ed2613d1d8f1389e4adada6b248be5e3a3a7d`, consultada y verificada contra remoto; copia local sin cambios previos al encargo. No se crean ramas adicionales.
- Referencia del código: [`8f81f9fa3165e3fc1253e7e834a23cfd26f7c551`](https://github.com/Tbl4z3r/AstroDetect/commit/8f81f9fa3165e3fc1253e7e834a23cfd26f7c551).
- Reporte previo: [QA educativa y recuperación 3D](QA-EDU-A1-attempt-03.md).
- Contratos y dependencias: extensión compatible de contrato y modelo a 1.1.0 para admitir masa estelar. Se documenta la migración y sus consumidores. No cambian dependencias, paquete de release, workflows, detector ni registro compartido. La elección del alcance fue consultada y respondida por el usuario antes de escribir.

## Alcance realizado

El selector «Modelo de estrella» ofrece cuatro ejemplos educativos internos: M, masa/radio 0,3/0,3; K 0,7/0,7; G 1/1; F 1,3/1,4, en unidades solares. No se presentan como estrellas observadas ni como una relación universal de masa y radio por clase. Cambia ambos valores, conserva planeta/período/ruido/semilla, reinicia el reloj e invalida la detección. Masa y radio pueden editarse; si no coinciden con un perfil, se muestra «Configuración libre» y se explicita que no valida una estrella real.

Se incorpora masa 0,2–1,6 M☉ y radio 0,2–2 R☉. En el contrato, `starMassSolar` es opcional: omitirlo conserva 1 M☉, mientras que una masa explícita inválida se rechaza. Todos los consumidores del semieje usan `a(P,M)` con `μ★=μ☉×M★/M☉`: geometría orbital, validación, ángulo de la escena y cantidades explicadas. El resto del dominio conserva Rp<R★ y separación física de los cuerpos.

La profundidad central depende de la razón de radios; cambiar sólo la masa conserva esa profundidad, pero modifica el semieje y la duración. Se conserva el solapamiento de discos, con una evaluación equivalente por segmentos circulares que reduce cancelación numérica cerca de contactos. No se cambia fase, PRNG, ruido, muestreo ni entrada del detector. La expresión equivalente puede modificar últimos bits dentro de las tolerancias ya comprobadas; no se exige identidad binaria.

Ambas vistas responden al perfil con el mismo color ilustrativo. No se calcula temperatura, luminosidad absoluta, actividad, oscurecimiento de limbo o respuesta de un telescopio. El esquema 3D sigue comprimiendo la distancia orbital y declarando cualquier ampliación del planeta; el observador conserva proporción de radios. Se conserva la corrección anterior de render durante la guía pausada.

«Entender» explica Kepler con masa vigente, clasificaciones, normalización, gigantes y remanentes compactos. Las compactas no son opciones activas: una ocultación completa no supera el 100 %, su emisión no equivale a un disco uniforme ordinario y la detección por llegada de pulsos de algunos púlsares es otro método. Se añade una comparación educativa del mismo planeta terrestre frente al modelo solar y la enana roja.

La serie mantiene 5.001 muestras y Δt=P/1000. Se declara la alineación deliberada de centros y muestras; si T14<3Δt se avisa de resolución limitada. Esto no altera el detector ni garantiza que tenga tres puntos bajo el umbral. Una no detección sigue sin demostrar ausencia de planeta.

Documentación de decisiones, fuentes y migración: [modelos estelares](../../docs/modelos-estelares.md), [contrato](../../docs/contratos.md) y [modelo científico](../../docs/modelo-cientifico.md).

Archivos de producto: `src/contracts/index.ts`; `src/simulation/geometry.ts`, `orbit.ts`, `validation.ts`; `src/components/stellarProfiles.ts`, `ScenarioControls.tsx`, `GuidedTour.tsx`, `LearningExperiments.tsx`, `HelpPanel.tsx`, `ModelReference.tsx`, `ScienceGuide.tsx`, `experimentMath.ts`, `Orbit3D.tsx`, `TransitAnimation.tsx`, `orbitScene.ts`; `src/styles/laboratory.css`. Pruebas: nuevos `tests/simulation/stellar-mass.test.ts` y `tests/e2e/stars.spec.ts`, además de adaptación de contratos, límites, matemáticas, teclado y estructura en sus pruebas existentes. La lista exacta se conserva en el commit de código.

## Verificaciones propias realmente ejecutadas

Windows, Node 22.12.0, npm 10.9.0 y Chromium. Se reutiliza la instalación limpia existente: no cambia package-lock ni se afirma haber ejecutado npm ci de nuevo en esta entrega.

| Control | Resultado |
|---|---|
| npm run lint | Aprobado, sin comentarios de código |
| npm run typecheck | Aprobado |
| npm test -- --run | 17 archivos, 318 pruebas aprobadas, 1,49 s |
| npm run build final | Aprobado: 47 módulos, 245 ms |
| npx vitest run --config tests/ui/browser.config.ts | 3 archivos, 7 recorridos aprobados, 13,59 s |
| npm run test:e2e | Repetición completa: 22 recorridos aprobados, 35,3 s |
| Comprobación visual adicional | Cuatro perfiles renderizados y redibujados tras resize durante Guía; disposición a 180, 320, 360 y 1280 px aprobada; cero errores de página |
| git diff --check | Aprobado |

Las nuevas pruebas científicas incluyen 64 combinaciones de extremos de masa/radio/planeta/período, masa omitida/undefined y rechazo de null/no finitos/fuera de rango, ley cúbica con una razón de masas de ocho, profundidad central independiente de masa, centros delanteros/traseros, contactos, duración y recuperación del escenario solar anterior. La prueba de cantidades incluye otras 64 combinaciones y una configuración válida con muestreo insuficiente.

Se registran fallos durante el desarrollo: la primera ejecución científica dio 251/253; dos contactos del nuevo dominio excedían la tolerancia 10⁻¹⁰ por cancelación numérica del área. Se corrigió la evaluación geométrica, sin relajar tolerancias, y la suite dirigida pasó 253/253. El primer E2E dio 19 aprobados, 2 fallidos y 1 no ejecutado: el recorrido de teclado aún esperaba radio como primer control y un test nuevo esperaba otra escritura/orden de la multiplicación de μ. Se adaptó el recorrido al selector, se sustituyó la comprobación literal por aritmética independiente y la repetición pasó 22/22. No se retiró una expectativa científica para ocultar un fallo de producto.

La matriz visual inspecciona capturas reales: más de 100 píxeles estelares en los cuatro perfiles antes y después de resize con Guía pausada. La enana roja tiene diferencia media R−G mayor de 40 y la F menor de 40, verificando que el renderer responde al perfil; esto prueba un color ilustrativo, no temperatura física. Se inspeccionaron las capturas roja y caliente. Los E2E comprueban además conversiones, semieje y profundidad con constantes independientes de los perfiles de la implementación, datos de la tabla y conservación del experimento.

[Evidencia de la entrega](../evidence/STARS-2026-11-02/) incluye resultados visuales, capturas y diez contextos concurrentes del E2E. Los archivos históricos T401/T402 regenerados durante pruebas se restauraron a su contenido anterior.

## Límites y continuidad

Las fuentes NASA se consultaron durante el trabajo y están enlazadas en la aplicación y la documentación; no se integran datos externos en ejecución. Se mantiene la advertencia conocida del chunk 3D de unos 512 kB. No se actualizan dependencias ni se declaran resueltos sus avisos previos. Pruebas limitadas a Chromium local y CI que se ejecute tras el push; no certifican Safari, Firefox, móviles físicos ni toda la astrofísica estelar.

La CI remota del commit de entrega no había corrido al redactar este archivo; no se registra como aprobada por anticipado. Consultar la ejecución de develop correspondiente a la referencia publicada. QA, main y production no se promueven en esta entrega. Producción seleccionará una candidata y aplicará el flujo de ramas; este reporte no declara DONE ni asigna otra tarea.
