# Revisión documental de A3 por A1

Fecha: 26 de octubre de 2026. Autor revisado: A3. Revisor: A1. Dictamen: REQUIERE_CAMBIOS. No constituye ejecución ni aprobación de pruebas de software.

## Alcance y evidencia

Se leyeron docs/calidad-y-despliegue.md, agents/instructions/03-analisis-calidad.md, docs/contratos.md, docs/colaboracion.md, AGENTS.md y README.md. Se contrastaron opciones del detector, interpretación científica, datos permitidos, responsabilidades de escritura y condiciones de parada.

Referencias de la entrega revisada, huellas SHA256 locales:

- docs/calidad-y-despliegue.md: `8379C78FB2988ABC0E6C5A21725DD8E129F52B399AA118C669AE9D4F27D9A591`.
- agents/instructions/03-analisis-calidad.md: `32FE91EAE45E77C34C8ED13B7256A4A6390EFB5544C3285D3133ED264B394AF8`.
- docs/contratos.md: `EAF9DFD14415E3A3718C9B3DDBEA4A3DEF476DE084C5B17CDBC9CE624ECA191F`.
- docs/colaboracion.md: `240BDC569280A546DA4CAF27D3B50C10684DBE622AF53C2922B6D3ABD2CE7F77`.

Inspección efectuada mediante lectura de archivos y búsqueda de líneas; las huellas identifican el contenido revisado sin afirmar que exista un commit remoto. No hay aplicación ejecutable ni resultados de detector en esta revisión.

## H1 · P2 · Usar las opciones del contrato en vez de valores fijos

Ubicación: docs/calidad-y-despliegue.md, líneas 17 y 21–25; agents/instructions/03-analisis-calidad.md, regla 3.

Reproducción documental: el contrato permite minSamples = 10, minEventsForPeriod = 4, periodToleranceFraction = 0.20 y noiseFloor = 1e-6. La especificación narrativa mantiene menos de siete muestras, grupos de tres, tres eventos, tolerancia 0.10 y piso 1e-8. Por ejemplo, una serie válida de ocho puntos debería dar insufficient-data porque contiene menos de max(7,10) puntos, mientras el texto de A3 permite analizarla.

Esperado: expresar las reglas en términos de minSamples, minEventsForPeriod, periodToleranceFraction y noiseFloor, identificando 3, 3, 0.10 y 1e-8 como valores predeterminados. Alinear la instrucción del rol con estos parámetros. Usar las opciones configuradas evita dos implementaciones distintas del mismo contrato.

Observado: la distinción entre opciones variables y valores predeterminados no se conserva en todas las etapas. Bloquea congelar este algoritmo como instrucción inequívoca de implementación.

## H2 · P2 · Reservar el cambio de estado al productor

Ubicación: agents/instructions/03-analisis-calidad.md, línea 37.

Reproducción documental: el rol indica «cambia la tarea a lista para revisión». El protocolo de colaboración dispone que sólo el productor sincroniza estados de ficha y registro; el agente informa el estado sugerido en su reporte.

Esperado: indicar que A3 propone REVIEW en el reporte y se detiene; producción actualiza el registro. Observado: el verbo autoriza al agente a modificar un estado fuera de su propiedad, aunque el resto del documento correctamente reserve la integración al productor. Corregir la instrucción de cierre antes de repartirla.

## H3 · P3 · Aclarar el tratamiento de cero o una muestra

Ubicación: docs/calidad-y-despliegue.md, línea 21.

La misma regla exige al menos dos tiempos distintos y también devuelve datos insuficientes para una serie válida de menos de siete puntos. El contrato central indica insufficient-data para entradas válidas menores de max(7,minSamples) y exige que tiempos presentes sean finitos y estrictamente crecientes. Precisar si vacío o una muestra son entradas válidas insuficientes, conservando la precedencia del contrato. No calcular mediana ni cadencia antes de resolver esa rama. Es una aclaración de frontera; no se observó un fallo ejecutable.

## Aspectos consistentes

El detector excluye parámetros verdaderos, flujo limpio, semilla y ruido real. Distingue candidatos de confirmación y no interpreta no detección como inexistencia de planeta. Los fixtures independientes, los falsos positivos, el límite de periodicidad y las advertencias están previstos. El rol prohíbe autoaprobación, ampliaciones de alcance y publicación por iniciativa propia. La documentación declara honestamente que pruebas y despliegue están pendientes.

## Siguiente acción autorizada

A3 corrige sus dos documentos tras asignación de producción; A1 revalida la nueva referencia. El revisor no modificó archivos de A3. Adicionalmente, por asignación expresa del productor, A1 ajustó sólo la configuración inicial de docs/modelo-cientifico.md a 1 radio solar, 10 radios terrestres, 5 días, 500 ppm y semilla 42 para coincidir con el contrato central. Esta corrección de archivo propio no se incluye como trabajo aprobado por este revisor.
