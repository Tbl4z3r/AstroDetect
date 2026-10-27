# T302 — A3 — Intento 01

- Fecha: 26 de octubre de 2026, America/Santiago. Versión objetivo: 0.1.0-alpha.
- Estado propuesto: DELIVERED al publicar esta rama y su PR. Producción integra y registra DONE.
- Rol funcional: A3; persona asignada: companero-1. Tarea exclusiva: T302.
- Base comprobada con `git fetch origin`: `38321214664c91aaae74d44b3f431be63c683d72`, main y reserva task/T302 coincidentes antes de escribir.
- Rama: task/T302, seguimiento de la reserva remota en copia local aislada. La copia de producción conservó su carpeta T301 no rastreada y la copia anterior T301 no se modificó.
- Referencia de fixtures, pruebas y evidencia: `aee7461599428353f06e393373045cc589b357ff`. El commit posterior añade este reporte y normaliza el fin de línea del log.
- Reporte previo de T302: ninguno. Leídos los reportes de T102 y T301; sus requisitos históricos de revisión no se reactivan.
- Registro remoto: T102 DONE, T301 DONE, T302 READY asignada a companero-1, owner A3 y reserva de PRODUCCION. Contrato y modelo 1.0.0 intactos.

## Alcance y expectativas previas

Se conservaron las 200 pruebas anteriores, incluido `tests/analysis/detect.test.ts`, sin editar. Se añadieron únicamente:

- `tests/fixtures/transit-cases.ts`: parámetros y expectativas de tres escenarios, semillas negativas, adaptador de observaciones, ruido independiente y disminución artificial.
- `tests/analysis/limits.test.ts`: siete pruebas independientes de ruido, señal periódica artificial y evento ausente.
- `tests/simulation/integration.test.ts`: nueve pruebas de integración, reproducibilidad y separación de datos.
- `agents/evidence/T302/results.json` y `targeted-run.txt`: resultados reales de la ejecución detallada.
- Este reporte nuevo.

Las semillas, parámetros y expectativas se fijaron en los archivos antes de la primera ejecución y no se ajustaron a los resultados. Todos usan DEFAULT_DETECTION_OPTIONS del contrato: thresholdSigma=4, minSamples=3, minEventsForPeriod=3, periodToleranceFraction=0.10 y noiseFloor=1e-8.

El adaptador principal construye objetos nuevos exclusivamente con timeDays y observedFlux, renombrado flux. Las pruebas comprueban las claves exactas, la igualdad con el flujo observado y un accesor de cleanFlux que lanza error si se consulta. Parámetros y expectativas se guardan fuera del argumento de detectTransits y se usan después para comparar resultados. No se pasa Scenario, período verdadero, radios, semilla o curva limpia al detector.

## Resultados observados

Cada escenario simulado tiene 5001 muestras, de 0 a 25 días, cadencia 0.005 días y semilla 42. Cada ejecución se repite y exige igualdad de observaciones y DetectionResult en este entorno.

- Señal clara limpia: estrella 1 radio solar, planeta 20 radios terrestres, período 5 días, ruido 0 ppm. Esperados y obtenidos cinco eventos y período 5 días; centros 2.5, 7.5, 12.5, 17.5, 22.5. Cada grupo tiene 31 muestras y profundidad 0.033620071508900784.
- Señal clara con ruido: mismos radios y período, ruido 500 ppm. Esperados y obtenidos cinco eventos, período 5 días y los mismos centros. Cada grupo tiene 29 muestras; profundidades desde 0.03317595800427364 hasta 0.03336811676407159. El umbral cambia los bordes aunque el escenario sea el mismo.
- Señal débil con ruido: estrella 2 radios solares, planeta 1 radio terrestre, período 5 días, ruido 5000 ppm. Esperados y obtenidos cero eventos, no-evidence y período null. Se comprueba separadamente que la curva limpia contiene muestras por debajo de uno: la no detección no demuestra ausencia de señal.
- Control negativo independiente: cinco series de 5001 puntos a cadencia 0.001 días, base 1, amplitud gaussiana 0.001. LCG uint32 con multiplicador 1664525, incremento 1013904223, uniformes (estado+0.5)/2^32 y Box–Muller coseno, independiente del generador del simulador. Semillas 1, 7, 42, 2026, 123456: respectivamente 0, 0, 0, 0, 0 eventos, todos no-evidence y período null.
- Control negativo del ruido del simulador: estrella 1, planeta 10, período 5 días y ruido 5000 ppm; mismas cinco semillas. El fixture elimina la señal como 1+(observedFlux-cleanFlux) antes de construir la entrada del detector. La verdad se usa exclusivamente para preparar este control sintético, nunca dentro del algoritmo ni en el adaptador principal. Resultado por semilla: 0, 0, 0, 0, 0 eventos, todos no-evidence y período null.
- Disminución instrumental artificial: 401 puntos, cadencia 0.01 días, flujo 0.99 durante cinco muestras alrededor de los centros 1, 2 y 3 días, flujo 1 fuera de ellas. Sin física orbital ni modelo planetario. Esperados y obtenidos tres candidatos, cinco muestras por grupo, profundidad próxima a 0.01 y período 1 día. Incluye advertencia de que un candidato no confirma un planeta.
- Control independiente con evento ausente: centros 0.5, 1.5 y 3.5 días; tres eventos recuperados y período null con advertencia de inconsistencia.

Para señal clara se exige error de período y centros no superior a dos cadencias (0.01 días), además de mínimo de muestras y profundidad positiva. Para la señal artificial se exige período a 12 decimales. Las profundidades numéricas anteriores son resultados registrados, no tolerancias nuevas ajustadas después de ejecutar. results.json conserva opciones, escenarios y los eventos completos, con sus bordes y advertencias.

## Verificaciones reales

Entorno: Windows, Node v22.12.0, npm 10.9.0, Vitest 5.0.5. Directorio de ejecución: AstroDetect dentro de la copia T302.

- `npm ci --no-audit --no-fund`: aprobado, 189 paquetes desde el lockfile; advertencia sobre el eslint existente sin soporte, sin cambiar dependencias.
- `npm test -- --run tests/analysis/limits.test.ts tests/simulation/integration.test.ts`: aprobado, dos archivos y 16 pruebas nuevas.
- Repetición detallada real: `node node_modules/vitest/vitest.mjs run tests/analysis/limits.test.ts tests/simulation/integration.test.ts --silent=false --reporter=verbose`: aprobada, 16 pruebas, 860 ms. Salida guardada en targeted-run.txt y registros JSON extraídos a results.json. El lanzador npm de este entorno no mostró los console.log con las opciones adicionales; se usó el ejecutable de Vitest directamente para capturarlos.
- `npm run lint`: aprobado, incluido control sin comentarios de código.
- `npm run typecheck`: aprobado.
- `npm test -- --run`: aprobado, 12 archivos y 216 pruebas, 6.34 segundos. Conserva las 200 anteriores y suma 16.
- `npm run build`: aprobado, 19 módulos, bundle JS 226.10 kB, gzip 71.29 kB.
- Comparación con la base: sin diferencias en src, dependencias ni tests/analysis/detect.test.ts; ningún algoritmo, contrato o archivo compartido cambiado.
- `git diff --cached --check`: primer control detectó una línea vacía extra al final del log; corregida en el commit del reporte y comprobada antes de publicar.
- E2E de navegador y CI del futuro PR: no ejecutados como parte de esta comprobación local. No se cambia ni conecta la interfaz. No se atribuye una ejecución remota todavía inexistente.

No hubo fallos de expectativas científicas o pruebas. Una búsqueda auxiliar con comodín literal de PowerShell devolvió error de ruta; no era un control del producto y no afectó las verificaciones.

## Límites y continuidad

Diez controles negativos sin candidatos en dos familias de cinco semillas no calibran una tasa universal de falsos positivos. Los controles residuales utilizan el propio modelo de ruido de T102; por eso no sustituyen los controles independientes. La eliminación de señal es una operación de fixture con verdad conocida, no una capacidad disponible para observaciones reales.

Un caso periódico artificial pasa la regla sin contener un planeta: candidato y período no identifican la causa física. El caso débil muestra una no detección con señal presente. La ventana y cadencia del simulador dependen del período configurado; son simplificaciones del modelo, no información que reciba el detector. No se cubre exhaustivamente el espacio de parámetros ni ruido correlacionado, huecos reales o poblaciones astronómicas. No se promete precisión, sensibilidad o probabilidad calibrada.

Se publica únicamente task/T302 y su PR. El autor propone DELIVERED y se detiene sin solicitar revisión, hacer merge, marcar DONE o iniciar T401 u otra tarea. Producción coordina integración y estados. Una reversión debe usar un commit posterior que retire estos archivos de T302, conservando las pruebas anteriores y el historial.
