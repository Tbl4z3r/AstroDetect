# Reporte T102 — A1 — Intento 01

- Fecha y versión objetivo: 26 de octubre de 2026; 0.1.0-alpha.
- Estado sugerido: REVIEW; revisión A2, auditoría real de Claude e integración pendientes.
- Tarea y rol: exclusivamente T102, serie temporal y ruido reproducible, A1. La petición vigente del usuario de seguir con T102 una vez habilitada sustituye el límite anterior a T101; no asigna otras tareas.
- Base de trabajo: `75aa53e7d1d5e184d8066905f1f9396f2749f0b6`, HEAD de `origin/main` verificado mediante fetch antes de reservar.
- Rama: `task/T102`, creada exclusivamente en remoto antes de editar y confirmada mediante `git ls-remote` en el SHA base; checkout local desde esa misma referencia.
- Referencia de código y pruebas: [`12dd63f12c28eab01e7b630fdc733735f5fb972d`](https://github.com/Tbl4z3r/AstroDetect/commit/12dd63f12c28eab01e7b630fdc733735f5fb972d). Este reporte y la evidencia se añaden después, sin cambiar ese código.
- Reporte previo: ninguno de T102. Antecedente consumido: [T101, intento 01](T101-A1-attempt-01.md).
- Dependencias y contratos consumidos: T101 DONE, T102 READY, propietario A1, leídos directamente del registro en main. PR #3 de T101 confirmado fusionado; cierre en [production-T101-close.md](production-T101-close.md), revisión A2 y auditoría de Claude incorporadas en la base. Contrato y modelo 1.0.0, constantes compartidas SAMPLING y NOISE_CONVENTION, sin cambios.

## Alcance realizado

Antes la API sólo ofrecía validación, posición y flujo instantáneo. Ahora `simulate(scenario)` devuelve la serie limpia y observada completa con duración y cadencia, manteniendo las tres funciones aprobadas de T101.

Archivos de producto: nuevos `src/simulation/random.ts` y `src/simulation/simulate.ts`, más una exportación añadida a `src/simulation/index.ts`. Pruebas nuevas: `tests/simulation/random.test.ts` y `tests/simulation/simulate.test.ts`. Documentación nueva: este reporte y [verification.json](../evidence/T102/verification.json). No se editaron pruebas anteriores, geometría, órbita, flujo, validación, interfaz, detector, contratos, dependencias, configuración ni registro compartido.

| Criterio de T102 | Evidencia ejecutada |
| --- | --- |
| 5001 muestras, extremos, cadencia y cinco centros | Casos P=1, 5, 13.7 y 30 días; orden estricto, t inicial 0, final 5P, cadencia P/1000, cinco tránsitos y centros en índices 500+1000k. |
| PRNG y Box–Muller exactos; seed=0 y sigma=0 | Estados uint32 precalculados y oráculo independiente BigInt para cuatro semillas y 10002 uniformes por semilla; fixtures gaussianos con dos uniformes por muestra y descarte de seno; igualdad de semilla cero con 1831565813 e igualdad exacta limpio/observado sin ruido. |
| Reproducción, ausencia de recorte e independencia de la curva limpia | Fixtures observados hasta el índice 5000, reinicio al intercalar otra simulación, independencia entre generadores y resultados, ruido proporcional a sigma, observado mayor que 1 conservado y curva ideal idéntica al cambiar ruido o semilla. |
| Preservar T101 y API | Suite científica previa íntegra y aprobada, módulo público compatible con SimulationEngine, reutilización de fluxAt en los mismos tiempos públicos y comparación Git sin cambios en los cuatro módulos científicos anteriores ni sus tres pruebas. |

Reserva: no existía rama ni PR de implementación de T102. Se ejecutó `git push --force-with-lease=refs/heads/task/T102: origin 75aa53e7d1d5e184d8066905f1f9396f2749f0b6:refs/heads/task/T102`. La expectativa vacía impide sustituir una referencia ya existente. La creación y su SHA se confirmaron antes de crear el checkout local. No se reutilizó ninguna rama ajena.

## Verificación real

Entorno local: Windows, PowerShell, Node 22.12.0, npm 10.9.0; Vitest 5.0.5; Playwright 1.64.1 y Chromium 156.0.8078.4. Comandos desde la subcarpeta de aplicación `AstroDetect` con ese runtime en PATH. Playwright usa el navegador ya instalado en el directorio de trabajo, fuera del repositorio.

- `npm ls --depth=0`: aprobado; todas las dependencias directas coinciden con las versiones fijadas. No se repitió `npm ci`: package.json y package-lock.json son idénticos a los de la instalación limpia utilizada en T101 y se reutilizó ese node_modules. No se atribuye una instalación ni auditoría de paquetes nueva a T102.
- `npm test -- --run tests/simulation/random.test.ts tests/simulation/simulate.test.ts`: aprobado, 2 archivos y 59 pruebas nuevas.
- `npm run lint`: aprobado, incluido el control de ausencia de comentarios de código.
- `npm run typecheck`: aprobado en modo estricto.
- `npm test -- --run`: aprobado, 9 archivos y 164 pruebas; conserva las 105 pruebas previas y suma las 59 de T102.
- `npm run build`: aprobado; 19 módulos transformados y salida estática generada.
- `npm run test:e2e`: aprobado; una prueba Chromium de arranque desde `/AstroDetect/` y carga de recursos. No es una prueba de interfaz de simulación, que queda fuera de T102.
- `git diff --cached --check`: aprobado sobre los cinco archivos de producto y pruebas antes del commit.
- Comparación Git con la base: sin diferencias en los módulos y pruebas previos de T101, contratos, registro, dependencias o configuración compartida.

El oráculo uint32 usa enteros BigInt, multiplicación/división por potencias de dos y reducción módulo 2^32, evitando los desplazamientos bitwise de 32 bits de la implementación. Para seed=42 los primeros estados esperados son 11355432, 2836018348, 476557059 y 3648046016; las primeras normales son -1.8404491679307617 y 1.225908490637386. Para seed=0 la primera normal esperada es -1.5016346033114911. Con seed=1 y 500 ppm, la primera muestra observada esperada es 1.002188466826796: permanece mayor que 1. Los fixtures de observación combinan estas normales independientes con niveles geométricos analíticos de centro y fuera de tránsito; no usan simulate como oráculo. Se aplica tolerancia absoluta 1e-12 a gaussianas y flujos observados, 1e-10 a la periodicidad limpia y se exige igualdad exacta entre observado y limpio con sigma cero.

No hubo intentos fallidos de estas verificaciones de T102. Playwright informó únicamente advertencias de variables de color del entorno y terminó con éxito. No se desactivaron reglas ni validaciones.

No ejecutados al redactar: CI del futuro PR, revisión independiente A2 y auditoría de Claude. El apoyo de autoría de pruebas permanece dentro de A1 y no sustituye ninguna de esas aprobaciones.

## Decisiones y límites

Cada simulación valida el escenario mediante la API existente antes de crear la serie. Los errores conservan los nombres de campo y lanzan RangeError explícito; no se corrigen entradas. Los generadores son auxiliares internos del módulo y no se exportan desde el índice público; reciben la semilla ya validada. Su estado pertenece a cada instancia, sin estado global compartido.

Las convenciones se importan del contrato: xorshift32 con conversión uint32 tras cada paso, sustitución explícita de semilla cero, uniforme abierto y Box–Muller con componente coseno y descarte del seno. Se consumen dos uniformes en cada muestra, incluso si sigma es cero. El flujo observado se calcula por suma directa `cleanFlux + noisePpm * 1e-6 * Z`, sin recortes. El límite superior se verifica con un caso dentro del dominio; no se fuerza un caso negativo mediante parámetros inválidos.

Los tiempos se calculan por índice a partir de P y SAMPLING, sin acumulación de cadencia. El último se fija al valor devuelto de duración 5P para conservar exactamente el extremo público frente al redondeo de coma flotante. El flujo limpio siempre lo calcula fluxAt de T101; no se duplica su física. Cada llamada devuelve muestras y objetos independientes.

Se conserva el modelo educativo congelado: ventana y cadencia dependen de P; ruido gaussiano aditivo pseudorrandómico, sin calibración estadística ni propiedades criptográficas. La tolerancia entre plataformas es 1e-12, no una promesa de identidad binaria de funciones trascendentes. No se añadieron interfaz, animación, detector, nuevas dependencias, optimizaciones ajenas a la ficha ni cambios de versión del modelo. No se ejecutaron los recorridos adicionales de UI ni se probaron otros navegadores o sistemas operativos localmente.

## Continuidad y reversión

Publicar únicamente task/T102 y un único PR hacia main enlazando este reporte. A1 propone REVIEW y se detiene, conforme a la secuencia de [auditoria-claude.md](../../docs/auditoria-claude.md). Producción registra el estado, asigna A2 e inicia una sesión real de Claude Code sobre la referencia final y la base. No se ha firmado ni simulado un dictamen de Claude desde Codex.

Sólo producción puede verificar las aprobaciones, integrar, declarar DONE y habilitar dependientes. A1 no toma T202, T301 ni otra tarea o revisión sin nueva asignación. Reversión, si producción la requiere, mediante nuevos commits que reviertan esta entrega y su documentación, sin reescribir historia ni cambiar trabajo ajeno; no hay despliegues, migraciones ni datos externos.
