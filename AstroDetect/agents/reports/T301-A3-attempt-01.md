# T301 — A3 — Intento 01

- Fecha: 26 de octubre de 2026, America/Santiago. Versión: 0.1.0-alpha.
- Estado propuesto: DELIVERED, condicionado a publicación de esta rama y su PR; producción integra y registra DONE.
- Autor funcional: A3; persona asignada: companero-1.
- Base remota comprobada mediante `git fetch origin`: `9886ca1a2f3747aa42871120a051ee14beb6fff0`, tanto main como task/T301. No había commits posteriores en la reserva ni cambios locales en la copia de producción.
- Rama exclusiva: `task/T301`, con seguimiento de la reserva remota, en una copia de trabajo aislada. No se duplicó la rama remota ni se modificó la copia de producción.
- Referencia de código y pruebas: `51c079273d7c9c18a47f93c915aee924ba866ac0`. El commit posterior agrega únicamente este reporte.
- Reporte previo: ninguno para esta tarea.
- Dependencia: T000 DONE; T301 READY, owner A3, assignedTo companero-1, reservedBy PRODUCCION, verificados en el registro de main actualizado. Contrato 1.0.0 conservado.

## Alcance realizado

Se añade `src/analysis/index.ts`, exportando `detectTransits(observations, options)` con firma compatible con TransitDetector. Sólo importa contratos. Valida opciones con la función compartida, finitud y orden estricto antes de decidir insuficiencia. Calcula mediana/MAD, escala 1.4826 y piso recibido; exige línea base positiva. Agrupa exclusivamente muestras consecutivas bajo el umbral estricto y conserva grupos con el mínimo configurado. Cada evento incluye extremos, punto medio, profundidad respecto de la mediana y cantidad de muestras.

La repetición usa la mediana de separaciones entre centros y la tolerancia máxima de dos cadencias o fracción configurada; requiere suficientes eventos y período superior a dos cadencias. Devuelve null con advertencia cuando no se satisface la regla. Advierte si la cadencia varía más de 10% y aclara que un candidato no confirma un planeta. Los cálculos no representables lanzan error explícito para evitar resultados infinitos. No ordena ni modifica las observaciones.

Se añade `tests/analysis/detect.test.ts`: 36 pruebas independientes, sin importar simulación. Se verifican flujo constante, tres caídas rectangulares, una y dos caídas, grupos cortos o separados, eventos en los bordes, umbral estricto, eventos ausentes, repetición irregular, cadencia irregular, opciones modificadas, datos insuficientes, entradas inválidas y determinismo. Accesores que lanzan error demuestran que no se lee metadato de flujo limpio ni período verdadero.

Opciones de referencia importadas del contrato: thresholdSigma=4, minSamples=3, minEventsForPeriod=3, periodToleranceFraction=0.10, noiseFloor=1e-8. Fixture rectangular de 401 puntos a cadencia 0.01 días: tres grupos de cinco muestras, profundidad 0.01, centros 1, 2 y 3 días; recuperados tres grupos y período 1 día con tolerancia de aserción 12 decimales. Profundidad comprobada a 12 decimales. Con una/dos caídas devuelve uno/dos grupos y período null; con centros 0.5, 1.5 y 3.5 devuelve tres grupos y período null.

Ruido independiente: LCG de estado uint32, multiplicador 1664525 e incremento 1013904223, uniformes (estado+0.5)/2^32, Box–Muller coseno; no utiliza el generador de simulación. Cada serie tiene 1001 muestras, cadencia 0.01 y amplitud 0.001. Semillas prefijadas 1, 7, 42, 2026, 123456: respectivamente 0, 0, 0, 0, 0 grupos, no-evidence y período null. La semilla 42 con disminución adicional de 0.0001 también produce no-evidence. Expectativas y generador quedan congelados en las pruebas.

## Verificaciones propias reales

Entorno: Windows, Node v22.12.0 y npm 10.9.0. Comandos desde la carpeta AstroDetect de la copia T301 salvo indicación contraria.

- `npm ci --no-audit --no-fund`: aprobado, 189 paquetes instalados desde el lockfile. El primer intento restringido se interrumpió sin terminar; un intento offline dio EPERM. La instalación con acceso necesario terminó con código 0. Aviso de versión sin soporte de eslint existente; no se cambió ninguna dependencia.
- `npm run lint`: aprobado, código 0; ESLint sin advertencias y control de ausencia de comentarios aprobado.
- `npm run typecheck`: aprobado, código 0.
- `npm test -- --run`: ejecución inicial restringida con 199 aprobadas y 1 fallo en discovery por imposibilidad de escribir el token temporal de Vitest. Repetición con acceso a temporales: 10 archivos, 200 pruebas aprobadas, código 0, 2.14 segundos. No se modificaron pruebas compartidas para resolver el acceso.
- `npm test -- --run tests/analysis`: aprobado, 36 pruebas, código 0, 407 ms. Un intento previo desde la raíz exterior T301 falló ENOENT por falta de package.json; se corrigió el directorio y se ejecutó realmente el comando indicado.
- `npm run build`: aprobado, código 0, 19 módulos; bundle JS 226.10 kB, gzip 71.29 kB.
- `git diff --check`: aprobado sin salida. Archivos añadidos limitados a análisis, sus pruebas y este reporte.
- E2E de navegador: no ejecutado; esta entrega no modifica interfaz ni conecta el detector a ella. La integración UI y los fixtures de simulación no pertenecen a T301.

## Límites y continuidad

Una caída rectangular periódica artificial, sin origen planetario, obtiene candidatos y repetición: documenta la incapacidad del método para distinguir causas. No confirma planetas ni devuelve probabilidades. Cinco semillas sin candidatos no estiman una tasa calibrada de falsos positivos. MAD global puede ocultar caídas frecuentes o poco profundas; el umbral altera bordes y profundidad. No recupera eventos perdidos ni busca múltiplos/divisores de un período. Cadencias variables sólo producen advertencia; no se rellenan huecos.

No cambia contratos, simulación, interfaz, dependencias, configuración ni registro. No se implementa T302. No se solicitan revisiones ni auditoría. Producción deberá integrar mediante el PR y actualizar estado; el autor propone DELIVERED y se detiene tras publicar. Reversión posible mediante un commit de producción que revierta los archivos de esta entrega, conservando historial.
