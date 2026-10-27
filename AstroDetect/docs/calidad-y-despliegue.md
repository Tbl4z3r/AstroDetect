# Calidad, detección y despliegue de AstroDetect

Estado: diseño de implementación; aplicación, pruebas y despliegue pendientes. Responsable funcional: A3. Producción mantiene los contratos compartidos y autoriza cambios de alcance.

## Propósito y límite

El análisis identifica disminuciones del flujo observado y examina si varias aparecen a intervalos parecidos. La salida es una señal compatible con un tránsito bajo un modelo educativo. No confirma un planeta, no estima una probabilidad de existencia y no sustituye un análisis astronómico profesional. El detector no será BLS en esta versión.

El simulador representa una estrella uniforme, un planeta oscuro, órbita circular, inclinación fija de 90 grados y masa estelar solar. A3 debe leer `docs/modelo-cientifico.md` y el contrato aprobado antes de implementar. Conocer estas simplificaciones no autoriza al algoritmo a leer la configuración verdadera.

## Separación de datos y contrato de detección

La entrada del detector contiene solamente una serie de pares de tiempo en días y flujo normalizado observado, más opciones del algoritmo. Quedan excluidos período verdadero, radios, semilla, amplitud verdadera del ruido, flujo sin ruido, máscara de tránsitos y posición del planeta. Los fixtures de prueba pueden conservar una verdad de referencia fuera de la entrada del detector.

La salida usa exactamente `DetectionResult` de `docs/contratos.md`: `status` con `candidate`, `no-evidence` o `insufficient-data`; `events`; `estimatedPeriodDays`, número o `null`; y `warnings`. Cada `TransitCandidate` contiene `startDays`, `endDays`, `centerDays`, `depth` y `sampleCount`. La interfaz traduce los estados al español. Las opciones usadas se registran junto al resultado en el reporte o la interfaz desde `DetectionOptions`, sin añadir propiedades a `DetectionResult`. A3 solicita cambios al productor antes de modificar el contrato.

`candidate` significa que existe al menos una disminución que satisface la regla del detector; por sí solo no implica periodicidad. Con menos de `minEventsForPeriod` eventos, el período siempre es `null` y la interfaz informa que no hay suficientes repeticiones. `no-evidence` expresa ausencia de eventos según esta regla, no ausencia demostrada de planeta. `insufficient-data` corresponde a una serie válida con menos de `max(7, minSamples)` muestras. Entradas no finitas, tiempos repetidos o desordenados y opciones inválidas producen un error de validación explícito, separado de los resultados científicos.

## Algoritmo inicial auditable

1. Validar valores finitos de los elementos presentes y orden temporal estrictamente creciente entre pares existentes. Validar `thresholdSigma > 0`, `noiseFloor > 0`, `minSamples` y `minEventsForPeriod` enteros de al menos tres, y `0 < periodToleranceFraction < 1`. No ordenar silenciosamente ni rellenar muestras. Para una serie válida de menos de `max(7, minSamples)` puntos, devolver `insufficient-data`, incluso si la serie está vacía o contiene una sola muestra; no exigir dos tiempos ni calcular medianas o cadencia en ese caso. Una única muestra con valores no finitos sigue siendo una entrada inválida.
2. Calcular la mediana del flujo como línea base `B`. Calcular `MAD = mediana(abs(flujo - B))`. Estimar escala robusta `s = max(1.4826 * MAD, noiseFloor)`. El piso es una tolerancia numérica del flujo normalizado, no ruido aportado por el simulador. Rechazar una línea base no positiva.
3. Marcar muestras con `flujo < B - thresholdSigma*s`. Agrupar solamente muestras consecutivas marcadas. Descartar grupos menores de `minSamples` muestras. No unir grupos separados para forzar eventos.
4. Para cada grupo conservado, registrar tiempos primero y último, centro como su punto medio, profundidad `B - mediana(flujo del grupo)` y cantidad de puntos. Esta profundidad puede subestimar o sesgar la profundidad física; el umbral modifica los bordes detectados.
5. Con menos de `minEventsForPeriod` eventos, devolver período `null`. Con suficientes eventos, calcular diferencias entre centros consecutivos y proponer `P_est = mediana(diferencias)`. Calcular cadencia como mediana de diferencias entre tiempos de entrada. Aceptar repetición solamente si todas las diferencias entre centros difieren de `P_est` en no más de `max(2*cadencia, periodToleranceFraction*P_est)`, y `P_est` supera dos cadencias. En caso contrario devolver período `null` y advertencia de repetición inconsistente.
6. El reporte o la interfaz registra las opciones efectivamente usadas y el número de grupos devueltos. No añadir una escala estimada u otros campos a `DetectionResult`. No mostrar una puntuación como porcentaje de certeza. Si la entrada tiene cadencias que varían más de 10% respecto de la mediana, incluir en `warnings` que la estimación de repetición es orientativa.

Valores iniciales del contrato: `thresholdSigma = 4`, `minSamples = 3`, `minEventsForPeriod = 3`, `periodToleranceFraction = 0.10` y `noiseFloor = 1e-8`. Los límites y reglas usan las opciones recibidas, no constantes duplicadas. Los casos de prueba descritos a continuación usan estos valores iniciales salvo indicación distinta.

Los valores anteriores son decisiones de diseño iniciales. Cualquier ajuste debe conservarse en el historial con evidencia de fixtures; no se ajustarán los umbrales usando exclusivamente el caso mostrado en la demostración. Esta regla no resuelve huecos de observación ni eventos perdidos; no busca múltiplos o divisores del período. Tránsitos poco profundos o muy ruidosos pueden quedar sin detectar. Ruido, estrellas variables o sistemas eclipsantes pueden producir señales parecidas; la herramienta sólo simula parte de esas posibilidades.

## Verificación con datos independientes

Las pruebas del detector construyen series propias, sin llamar al generador de A1 para fabricar todas sus expectativas. Se conservan semillas y resultados esperados. Las pruebas de integración añaden series del simulador sin reemplazar estos controles independientes.

- Serie constante de flujo uno: cero eventos, `no-evidence` y período `null`, incluso con MAD cero.
- Serie rectangular limpia con tres caídas de profundidad 0.01, cada una de cinco muestras, en centros separados por un día y cadencia 0.01 días: tres candidatos y período cercano a un día dentro de dos cadencias.
- Mismo diseño con una caída y luego con dos: eventos recuperados, período `null`, explicación de evidencia temporal insuficiente.
- Valores extremos aislados de una y dos muestras: no se aceptan como eventos por el mínimo de tres puntos.
- Ruido gaussiano con semilla fija y sin señal: resultado registrado sobre un fixture congelado. No convertir el resultado de una sola semilla en una garantía de tasa de falsos positivos; ejecutar además un conjunto finito de semillas prefijadas y reportar candidatos por serie.
- Serie con caídas no periódicas: eventos posibles, período `null`. Una serie artificial con caídas periódicas no planetarias debe producir candidatos: evidencia documentada de la limitación del método.
- Flujo con tres grupos y un evento ausente: no exigir recuperación del período verdadero; verificar salida `null` si los intervalos fallan la regla.
- Serie con ruido alto o tránsito bajo el umbral: salida permitida sin evidencia, sin afirmar que el planeta no existe.
- Casos inválidos: `NaN`, infinito, tiempos duplicados o desordenados, línea base no positiva y opciones fuera de rango producen validación visible.
- Serie de seis muestras, vacía o de un punto: `insufficient-data`. Serie suficiente sin eventos: `no-evidence`. No confundir ambos resultados.
- Opciones distintas de las iniciales: verificar que `minSamples` cambia el filtro de grupos y el mínimo de datos, `minEventsForPeriod` cambia la exigencia de repetición y `periodToleranceFraction` cambia la tolerancia. Verificar también el uso de `thresholdSigma` y `noiseFloor`, sin consultar la configuración real del simulador.

Cada prueba informa resultado observado y tolerancia. Está prohibido registrar como aprobada una prueba que no se ejecutó. Una corrección incluye un caso de regresión cuando el defecto pueda verificarse automáticamente.

## Entrega sin revisión de código

No se realiza revisión cruzada ni auditoría de Claude. Cada autor ejecuta las verificaciones pertinentes de su propia tarea, conserva fixtures y evidencia, publica su rama/PR y reporte y propone DELIVERED. Producción integra entregas con controles satisfactorios y registra DONE. No se ordenan lecturas o aprobaciones de código a otro agente. Las pruebas descritas en este documento siguen siendo requisitos técnicos del autor y de las tareas de comprobación expresamente asignadas.

## Controles de integración previstos

No hay configuración ejecutable de integración continua entregada por este documento. Al crear la base de la aplicación, producción debe definir scripts reales y un archivo de dependencias bloqueadas. La secuencia prevista es `npm ci`, `npm run lint`, `npm run typecheck`, `npm test -- --run` y `npm run build`. La elección de Vitest deberá hacer válido ese argumento de pruebas. Las pruebas de extremo a extremo tendrán un script separado, por ejemplo `npm run test:e2e`, con navegador instalado y servidor de previsualización disponible.

Se verifican adicionalmente: interacción por teclado, controles con etiquetas y unidades; móvil de 360 píxeles sin desplazamiento horizontal; pausa y movimiento reducido; curva y animación con el mismo reloj de simulación; ruido que permanece idéntico al pausar o reproducir la misma semilla; cambio de parámetros que invalida resultados anteriores; mensajes claros de error; y ausencia de solicitudes necesarias a servicios externos después de cargar los recursos.

El control de comentarios deberá detectar comentarios de código usando las herramientas del lenguaje, sin confundir URLs o literales con comentarios. La explicación técnica reside en documentos Markdown. No insertar comentarios, docstrings ni bloques comentados en los archivos fuente por iniciativa del agente.

## Publicación gratuita prevista

GitHub Pages sirve sitios estáticos y está disponible para repositorios públicos con GitHub Free. Esto hace viable el diseño previsto; el cálculo en cada navegador evita mantener un servidor de simulación. Diez personas usan sesiones independientes. No hay promesa de disponibilidad o capacidad medida hasta probar el despliegue. [Documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), consultada el 26 de octubre de 2026.

En Vite se prevé la base `/AstroDetect/`; la dirección esperada, aún no publicada, es `https://tbl4z3r.github.io/AstroDetect/`. Usar una sola pantalla sin rutas profundas inicialmente. Los recursos deben resolverse desde la base y no desde la raíz del dominio. Verificar recarga y acceso desde un teléfono en la dirección publicada.

Primera publicación: una persona con permisos del repositorio habilita Pages con GitHub Actions; producción prepara el flujo; se ejecutan los controles sobre el mismo commit; una ejecución manual publica el artefacto de compilación verificado. Evitar publicar cambios desde ramas de terceros. Registrar SHA, fecha, URL y resultado de la verificación. Una regresión se resuelve publicando el último commit verificado y registrando la reversión; no borrar el historial.

La documentación oficial establece límites y posibles restricciones de servicio; un servicio gratuito no equivale a recursos ilimitados. El volumen previsto parece pequeño por su diseño estático, pero esta es una estimación, no una prueba de carga. No recolectar datos personales, incorporar analítica o añadir autenticación al MVP. [Límites oficiales de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), consultados el 26 de octubre de 2026.

## Evidencia de versión

Cada entrega conserva una tarea, un reporte de autor con verificaciones propias y, al integrar, una entrada de cambios. El reporte identifica versión objetivo, tarea, agente, base y SHA entregado, archivos, comportamiento antes y después, pruebas reales con resultados, limitaciones, dependencias y siguiente acción autorizada. Si no existe aplicación ejecutable, declararlo expresamente. Las capturas o resultados futuros no deben escribirse como evidencia ya obtenida.
