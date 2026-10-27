# T402 · aceptación del MVP · intento 01

- Autor: A3, por asignación expresa de producción; aceptación propia de T402, sin revisión del código de otros agentes.
- Fecha local: 26 de octubre de 2026, America/Santiago.
- Referencia de aplicación comunicada por producción: T401 `9119313b032f84ecb2d462cc777b4ab77e76b41d`, registro posterior `af72ed2` con T401 DONE y T402 asignada.
- Entrega: archivos locales, sin commit, push o modificación del registro por este agente. Producción fijará el SHA final.
- Estado propuesto: **DELIVERED**. Los controles de aceptación y la medición coordinada de rendimiento están documentados; producción conserva integración y declaración de DONE.

## Archivos de esta entrega

- `tests/e2e/acceptance.spec.ts`.
- `agents/evidence/T402/mobile-360.png`.
- `agents/evidence/T402/ten-contexts.json`.
- `agents/reports/T402-A3-attempt-01.md`.

Producción aportó además `agents/evidence/T402/performance.bench.ts` y `agents/evidence/T402/performance.json` para completar el criterio de medición pura. A3 leyó el JSON y documenta esa evidencia con su procedencia; no se atribuye la ejecución de producción.

No se modificaron `src/`, contratos, dependencias, configuración Playwright o scripts. Los archivos de preparación T403 son otra entrega, documentada por separado. No se reorganizó el repositorio.

## Recorridos comprobados

Se añadieron tres pruebas de aceptación con timeout máximo de 30 segundos por prueba. La primera configura el período y el ruido, verifica 5001 muestras, reproduce y pausa, añade ruido y ejecuta la búsqueda. Comprueba candidato y período estimado junto a la advertencia de no confirmación planetaria. Cambia semilla 42→43→42 y comprueba que retorna exactamente la misma curva observada; la semilla nueva invalida el resultado anterior. Una entrada inválida suspende datos, muestra error y deshabilita el análisis; restablecer recupera el funcionamiento.

Después de cargar, esa prueba pone el contexto sin conexión y registra solicitudes. La configuración y la detección funcionan sin solicitudes nuevas: evidencia del cálculo local durante ese recorrido, no una afirmación sobre todos los navegadores o sobre persistencia offline después de recargar.

La segunda prueba usa viewport 360×800 y preferencia de movimiento reducido. Navega desde el enlace de salto mediante teclado, provoca y corrige un error con teclas, avanza una muestra, manipula el tiempo y ejecuta la detección mediante teclado. Verifica reproducción continua deshabilitada con avance manual disponible, mensajes accesibles, sincronización temporal y ausencia de desplazamiento horizontal. La captura completa se conserva en `mobile-360.png`; es emulación de viewport, no una prueba en un teléfono físico.

La tercera abre diez contextos de navegador independientes simultáneamente. Cada uno carga la aplicación, cambia su propia semilla, ejecuta el detector y conserva 5001 muestras. No se observaron errores de página, solicitudes fallidas o respuestas HTTP de error. Esta prueba se hizo contra preview local; no mide todavía el alojamiento público de GitHub Pages.

## Comandos y resultados reales

- `npm run lint`: exit 0; ESLint y comprobación de ausencia de comentarios satisfechos.
- `npm run typecheck`: exit 0.
- `npm test -- --run`: exit 0; 14 archivos y 222 pruebas aprobadas, duración informada por Vitest 2.96 segundos.
- `npm run build`: exit 0; Vite informó 33 módulos y 337 ms de compilación. Este tiempo es de construcción del sitio, no de generación de datos.
- `npm run test:e2e`: exit 0; cuatro pruebas Chromium aprobadas, incluidos smoke existente y los tres recorridos nuevos, duración total informada 8.2 segundos.

Los primeros intentos de test y build se detuvieron antes de cargar configuración por EPERM al escribir `node_modules/.vite-temp`. Se volvieron a ejecutar los mismos comandos con permiso para los temporales de la copia autorizada. Esos intentos iniciales son un fallo de acceso del entorno, no una prueba de aplicación aprobada. No se desactivaron aserciones o controles.

## Entorno y diez sesiones

Windows `win32 10.0.26200`, Node `v22.12.0`, Chromium `156.0.8078.4`, Intel Core i5-12450H de 12.ª generación y 12 procesadores lógicos. Cada contexto de la prueba concurrente usó 1280×900. La evidencia JSON conserva el instante UTC `2026-10-27T01:01:47.260Z`, correspondiente al 26 de octubre por la noche en Santiago.

Diez contextos se completaron en 1314 ms totales, con tiempos individuales de 1067 a 1258 ms para cargar, configurar y detectar. Todas las listas de errores quedaron vacías. Son mediciones del recorrido y de ese equipo local; no equivalen al tiempo aislado del motor ni a una garantía de capacidad pública.

## Rendimiento puro de 5001 puntos

Producción ejecutó la medición de `simulate` y `detectTransits` y guardó los datos en `agents/evidence/T402/performance.json`, leído por A3 para esta entrega. El script reproducible es `agents/evidence/T402/performance.bench.ts`. Según la evidencia de ejecución comunicada por producción, el comando `node node_modules/vitest/vitest.mjs run --config ../../performance.config.mjs` aprobó un caso en 1.82 segundos, con configuración temporal fuera de la aplicación.

Se midieron funciones puras síncronas, excluyendo renderizado y red, en Node v22.12.0, Windows x64. Cada uno de tres escenarios produjo 5001 puntos y se midió 50 veces después de cinco calentamientos: predeterminado, señal clara y señal débil. En el predeterminado, la mediana de generación fue 4.0773 ms y la de detección 3.9370 ms. Los máximos de los tres escenarios fueron 5.8255 ms para generación y 5.4528 ms para detección. Todas las llamadas registradas estuvieron por debajo del objetivo inicial de 200 ms.

El objetivo se cumplió en este equipo y esta muestra de ejecuciones. No constituye un límite universal de CI, una garantía para todos los navegadores ni una medida del renderizado. El fixture de señal débil produjo `no-evidence`, sin convertir ese estado en demostración de ausencia planetaria. La evidencia conserva escenarios, semillas, mínimos, medianas, percentil 95 y máximos; no se sustituye por la duración de build o de diez recorridos.

## Procesos, límites y continuidad

Playwright terminó normalmente y cerró su servidor de preview. Se comprobó que no quedaba listener en el puerto 4173 después de ejecutar las pruebas. Producción fue avisada de que puede retomar capturas y comprobaciones públicas sin colisión con este agente.

No se ejecutó aceptación pública, no se usó un teléfono físico, no se publicó el sitio y no se verificó un conjunto amplio de navegadores. La publicación requiere su propia ejecución y evidencia T403. No hay revisión cruzada ni auditoría: la política vigente pide controles del autor y coordinación de producción.

Siguiente responsable: producción para integrar esta entrega, actualizar el estado de T402 y continuar T403 cuando corresponda. Este agente no marca DONE ni inicia nuevas tareas por su cuenta.
