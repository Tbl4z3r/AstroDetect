# Reporte T101 — A1 — Intento 01

- Fecha y versión objetivo: 26 de octubre de 2026; 0.1.0-alpha.
- Estado sugerido: REVIEW; revisión independiente e integración pendientes.
- Tarea y rol: exclusivamente T101, geometría orbital y flujo ideal, A1.
- Base de trabajo: `98ffec73e2d81adfc136168ab0330d9441bd1ac9`, verificada como HEAD de `origin/main` mediante fetch y como ancestro mediante `git merge-base --is-ancestor` (salida 0).
- Rama: `task/T101`, local y remota. La instrucción vigente exige este nombre exacto y prevalece sobre el ejemplo con sufijo del protocolo.
- Referencia del código y pruebas: [`88e24ca70489f7743d76110bc411301803658e43`](https://github.com/Tbl4z3r/AstroDetect/commit/88e24ca70489f7743d76110bc411301803658e43). El reporte y la evidencia se agregan después sin modificar ese código.
- Reporte previo: ninguno de implementación T101. La comprobación anterior bloqueada no produjo una reserva ni cambios.
- Dependencias y contratos: T000 DONE, T101 READY y propietario A1, leídos directamente de `origin/main:AstroDetect/agents/tasks/backlog.json`. Contrato y modelo 1.0.0 de `src/contracts/index.ts`, `docs/contratos.md` y `docs/modelo-cientifico.md`, sin modificaciones. Se leyeron los cuatro reportes de T000 y las tres revisiones A3; cierre en [T000, intento 04](T000-PRODUCTOR-attempt-04.md).

## Alcance realizado

Antes no existía implementación científica. Ahora `src/simulation/index.ts` exporta `validateScenario`, `positionAt` y `fluxAt` con las firmas compartidas, sin crear una implementación incompleta de `SimulationEngine.simulate`.

Archivos nuevos de código: `src/simulation/geometry.ts`, `orbit.ts`, `flux.ts`, `validation.ts` e `index.ts`. Archivos nuevos de pruebas: `tests/simulation/geometry.test.ts`, `orbit-flux.test.ts` y `validation.test.ts`. Documentación nueva: este reporte y [evidencia resumida](../evidence/T101/verification.json). Las rutas de código abreviadas en este párrafo pertenecen a `src/simulation/`; las de pruebas a `tests/simulation/`.

| Criterio T101 | Implementación y evidencia ejecutada |
| --- | --- |
| Dominio, unidades y fase | Límites y constantes importados del contrato, errores por campo, semilla entera inclusiva y comprobación de separación física. `positionAt` y `fluxAt` lanzan RangeError explícito para escenarios inválidos o tiempos no finitos. Pruebas de validación, semiejes SI y fases conocidas. |
| Centros y contactos | Intersección exacta de discos; centro delantero `1-(r/R)^2`, centro trasero exactamente 1. Pruebas de cuatro contactos, contención, tangencia y radios extremos sin NaN. |
| Periodicidad y duración | Vueltas positivas y negativas, cinco centros, simetría y tres duraciones contrastadas con expectativas analíticas independientes. Ocultación parcial contrastada con integración numérica de secciones verticales. |
| API limitada | Sólo las tres consultas públicas asignadas; funciones puras sin DOM, red, ruido, interfaz, animación ni detector. Prueba de compatibilidad de tipos con las firmas de SimulationEngine y de independencia respecto a ruido/semilla. |

La reserva se hizo antes de editar mediante `git push --force-with-lease=refs/heads/task/T101: origin 98ffec73e2d81adfc136168ab0330d9441bd1ac9:refs/heads/task/T101`. La expectativa vacía exige que la referencia remota no exista; no permite reemplazar una rama existente. Git confirmó creación nueva y `git ls-remote` confirmó exactamente el SHA base. Antes de reservar se consultaron todas las ramas con ese nombre y todos los PR existentes: sólo había PR de T000, ninguno de T101. Después se creó el checkout local sobre la misma base. No se reutilizó trabajo ajeno.

## Verificación real

Entorno: Windows y PowerShell, Node 22.12.0 y npm 10.9.0. El runtime oficial descargado se verificó con SHA256 contra SHASUMS256.txt del mismo lanzamiento y quedó fuera del repositorio. Chromium 156.0.8078.4, Playwright 1.64.1. Comandos desde la subcarpeta de aplicación `AstroDetect`, con ese runtime en PATH:

- `npm ci`: aprobado, 189 paquetes añadidos, 190 auditados y cero vulnerabilidades informadas. Sin cambios al lockfile.
- `npm run lint`: aprobado, incluido el control de ausencia de comentarios.
- `npm run typecheck`: aprobado con TypeScript estricto.
- `npm test -- --run`: aprobado, 6 archivos y 104 pruebas; 75 pruebas nuevas en los tres archivos de simulación, más las 29 existentes.
- `npm run build`: aprobado; 15 módulos transformados y salida estática generada.
- `node_modules/.bin/playwright install chromium`: aprobado, navegador instalado fuera del repositorio. `npm run test:e2e`: aprobado, una prueba de arranque y recursos desde `/AstroDetect/`; no verifica una interfaz científica todavía inexistente.
- `git diff --cached --check`: aprobado sobre los ocho archivos de código y pruebas antes del commit.
- Comparación con la base: contratos, registro, dependencias y configuración no tienen cambios. Sólo se prepararon los archivos permitidos de T101.

Oráculos independientes de las funciones comprobadas: semiejes de Kepler precalculados para P=1, 5 y 30 días; flujo central para las razones de radio nominales; lente exacta de dos círculos unitarios; y suma midpoint de alturas verticales de los discos, que no reutiliza la fórmula cerrada de geometría. Las tres comparaciones de área usan 50000 secciones y tolerancia absoluta 2e-8. El fixture de flujo parcial procede de una integración separada de 4000000 secciones. Para el escenario inicial: semieje esperado 8560644525.098671 m, flujo central 0.991594982122775, duración T14 0.14138454646614354 días y flujo parcial 0.9958792674903914 en t=2.564741816043867 días. La tolerancia de flujo es 1e-10; la duración medida por búsqueda del borde fotométrico se compara con el valor analítico con tolerancia 1e-6 días. Se recorrieron además ocho combinaciones extremas de radios/período con 1001 tiempos por órbita.

Incidencias resueltas, no contadas como aprobaciones: la primera suite completa en el entorno restringido falló en la prueba existente de descubrimiento porque Vitest no podía crear su token temporal; se repitió con acceso permitido y pasó. Una aserción inicial de cota de área difería en una unidad de último lugar y se ajustó a la tolerancia de redondeo. Lint rechazó un literal de prueba con demasiada precisión; se sustituyó por el cociente de radios nominales y se repitieron lint y las 104 pruebas con éxito. La advertencia de soporte de ESLint 9.39.5 ya pertenecía a la base; no se cambiaron dependencias.

No ejecutados al redactar este reporte: CI del futuro PR y revisión independiente A2. Los resultados locales no equivalen a esas aprobaciones. El apoyo de autoría de pruebas se realizó dentro de A1; no se presenta como revisión formal ni aprobación de A2.

## Decisiones y límites

El semieje se deriva en metros del período convertido a segundos. La posición pública divide por el radio estelar y conserva tiempos en días. Se reduce el tiempo módulo P antes de evaluar la fase para evitar ángulos enormes. `inFront` usa el intervalo abierto de fase equivalente a z>0; las cuadraturas exactas se consideran z=0 y no delanteras, evitando que el redondeo de cos(π/2) decida el signo.

El flujo calcula el solapamiento con radio estelar normalizado a 1. Las ramas de discos separados y contenidos se resuelven antes de dividir. Se acotan los argumentos de arccos, el radicando y el área a sus límites físicos para proteger contactos de errores de redondeo; no se corrigen entradas inválidas. El tiempo debe ser finito; a tiempos enormes, la resolución de fase está limitada por la precisión del número recibido.

La comprobación `a > Rstar + Rp` está implementada, aunque ningún escenario dentro de los límites congelados la viola: el semieje mínimo es aproximadamente 2927699245 m y la suma máxima de radios es 1518962000 m. No se alteraron los límites para forzar una rama artificial en las pruebas.

Se mantienen las simplificaciones del modelo: estrella uniforme, planeta opaco, órbita circular y tránsito central con inclinación fija. No se implementaron muestreo, `simulate` ni PRNG (T102), tampoco controles, animación, detector o visualización. No hay nuevos contratos, paquetes, configuración compartida ni modificaciones del registro. No se verificaron otros navegadores o plataformas localmente. El estado compartido permanece a cargo de producción.

## Continuidad y reversión

Entrega mediante un único PR `task/T101` hacia `main`, enlazando este reporte. Producción asignará la revisión independiente a A2 sobre el SHA final del PR. A2 debe reproducir las comprobaciones pertinentes y registrar hallazgos; este autor no aprueba el cambio. Sólo producción puede integrar, sincronizar el registro y declarar DONE.

Reversión si producción la requiere: nuevos commits que reviertan el commit de código identificado y la documentación de esta entrega, sin reescribir historia ni modificar trabajo ajeno. No hay despliegue, datos ni migraciones. A1 propone REVIEW y se detiene tras publicar el PR; no toma T102 ni revisiones sin nueva asignación explícita.
