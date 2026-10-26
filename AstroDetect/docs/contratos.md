# Contratos de integración — v1 congelado

Congelado por producción en T000 el 26 de octubre de 2026. Tipos y valores compartidos en src/contracts/index.ts, versión 1.0.0. Las funciones científicas y el detector se implementan en sus tareas; aquí sólo se definen sus firmas. Un cambio requiere solicitud en un reporte, consumidores afectados, migración y aprobación del productor. Ningún agente crea una variante silenciosa.

## Entradas y unidades

`Scenario`: `starRadiusSolar` número entre 0.5 y 2; `planetRadiusEarth` número entre 1 y 20; `periodDays` número entre 1 y 30; `noisePpm` número entre 0 y 5000; `seed` entero de 0 a 4294967295.

Valores iniciales: 1, 10, 5, 500 y 42, respectivamente. Masa fija solar, inclinación fija 90°, excentricidad cero. Todos los valores deben ser finitos. Rechazar entrada inválida con mensaje por campo; no corregir silenciosamente. `seed=0` debe ser válido, nunca un generador trabado.

Derivar el semieje de Kepler con constantes documentadas y validar `a > Rstar + Rp`. No hay un control independiente de semieje. Las unidades internas físicas son SI; los tiempos públicos son días. `t0 = periodDays / 2`. Observación de t=0 a t=5P, con 5000 intervalos uniformes y 5001 muestras incluyendo ambos extremos. Ventana y cadencia dependen del P configurado: son una simplificación didáctica visible, no una inferencia del detector.

## Salidas y funciones públicas previstas

`ValidationResult`: `{ valid: boolean, errors: { field: string, message: string }[] }`.

`Position`: `{ xOverStarRadius: number, yOverStarRadius: number, inFront: boolean }` en la proyección del cielo. La curva y la animación consultan `positionAt(scenario, timeDays)`, que usa exactamente la misma fase que el motor.

`LightSample`: `{ timeDays: number, cleanFlux: number, observedFlux: number }`. Flujo relativo adimensional respecto de la estrella no ocultada. `cleanFlux` permanece entre 0 y 1; el ruido aditivo puede producir `observedFlux > 1`. No recortar los datos observados.

`SimulationResult`: `{ samples: LightSample[], durationDays: number, cadenceDays: number }`.

Motor: `validateScenario(scenario)`, `positionAt(scenario, timeDays)`, `fluxAt(scenario, timeDays)` y `simulate(scenario)`. `simulate` falla de forma explícita para parámetros inválidos; la UI valida antes de llamarlo. Funciones puras sin estado global, DOM, React ni llamadas de red.

El contrato de determinismo exige que la misma entrada produzca la misma serie en ejecuciones repetidas. T000/A1 fijan PRNG, transformación gaussiana y constantes; cualquier cambio que altere muestras requiere registrar versión de modelo y regenerar fixtures de forma revisada.

## Separación del detector

`Observation`: `{ timeDays: number, flux: number }`. El adaptador UI transforma las muestras usando únicamente `observedFlux`.

`DetectionOptions`: `{ thresholdSigma: number, minSamples: number, minEventsForPeriod: number, periodToleranceFraction: number, noiseFloor: number }`, inicialmente 4, 3, 3, 0.10 y 0.00000001. Opciones de algoritmo; no reciben la verdad del escenario. Umbral y piso deben ser positivos; minSamples y minEventsForPeriod son enteros de al menos 3; la tolerancia debe ser mayor que cero y menor que uno. Una serie válida de menos de max(7, minSamples) muestras retorna datos insuficientes.

`TransitCandidate`: `{ startDays: number, endDays: number, centerDays: number, depth: number, sampleCount: number }`.

`DetectionResult`: `{ status: 'candidate' | 'no-evidence' | 'insufficient-data', events: TransitCandidate[], estimatedPeriodDays: number | null, warnings: string[] }`.

`detectTransits(observations, options)` sólo puede importar contratos y utilidades matemáticas propias. No importa simulación, no consulta controles, no recibe `cleanFlux`, período real, semilla ni sigma verdadero. Las muestras deben ser finitas y de tiempos estrictamente crecientes; entrada incorrecta produce error explícito y no un resultado científico vacío.

`candidate` significa al menos un evento que supera los criterios del detector; no es confirmación de planeta. Período no nulo requiere al menos minEventsForPeriod eventos con separaciones compatibles dentro de max(2 cadencias, periodToleranceFraction por el período estimado). `no-evidence` no prueba ausencia de planeta. `insufficient-data` cubre series demasiado cortas para los criterios mínimos. No emitir probabilidades ni significancia estadística calibrada.

## Pruebas de contrato obligatorias

La misma fase y flujo deben corresponder al mismo tiempo en animación y curva. Detector aislado usando fixtures manuales; ruido fijo reproducible; ninguna salida NaN/Infinity en el dominio válido; cambio de parámetros invalida resultados. Las implementaciones y los textos de interfaz deben usar estos mismos nombres de estado mediante traducciones visibles al español.

## Decisiones congeladas en T000

La API pública de tipos, valores, límites, constantes, muestreo y validación de opciones se exporta desde `src/contracts/index.ts`. Los consumidores importan esos valores y no crean copias locales. `SimulationEngine` y `TransitDetector` fijan firmas; no son implementaciones ni mocks.

La validación científica `validateScenario` pertenece a A1: incluye finitud, límites y separación física. T000 sólo implementa `validateDetectionOptions`, que retorna ValidationResult por campo sin mutar la entrada. Las entradas de estas funciones son objetos del tipo declarado; la decodificación de fuentes externas no forma parte de este contrato.

Constantes nominales: radio solar 695700000 m; radio terrestre ecuatorial 6378100 m; parámetro gravitacional solar 1.3271244e20 m³/s²; día 86400 s. Son las mismas de docs/modelo-cientifico.md.

Modelo de ruido v1: xorshift32 con estado uint32 inicial seed, sustituyendo cero por 1831565813. Por uniforme: XOR desplazamiento izquierdo 13, XOR derecho sin signo 17, XOR izquierdo 5, convirtiendo a uint32 tras cada paso. U=(x+0.5)/4294967296. Por muestra consumir dos uniformes y usar sqrt(-2 ln U1) cos(2π U2), descartando seno. Reiniciar estado por serie. Semilla 0 comparte secuencia con 1831565813. Con ruido cero, observado coincide exactamente con limpio. Comparaciones entre plataformas usan tolerancia 1e-12 para flujo. El algoritmo se documenta aquí y se implementará únicamente en T102.

Detección: entradas incorrectas y línea base no positiva lanzan Error explícito; validar opciones antes de calcular. Series válidas vacías o cortas producen insufficient-data. Un período estimado exige además superar dos cadencias, según docs/calidad-y-despliegue.md. No hay detector en T000.
