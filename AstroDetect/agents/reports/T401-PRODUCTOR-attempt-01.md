# T401 — Integración del laboratorio y resultados

Fecha: 26 de octubre de 2026. Autor funcional: PRODUCTOR; ejecución delegada a A2 para esta asignación. Estado propuesto: **DELIVERED**. Sólo producción actualiza el registro, integra y declara DONE.

## Base y alcance

Base proporcionada y confirmada por producción: `4b48bc5f36db7b62ed01b039fc15a20fbcbfb454`. Dependencias T202, T301 y T302 confirmadas DONE en el registro local y por producción en GitHub. Contrato v1 conservado. Esta carpeta de ejecución no expone `.git`; `git rev-parse` no pudo verificar la base directamente. No se hicieron commits, cambios de rama, push, despliegue ni reorganización.

Se implementó exclusivamente T401: conectar el detector existente al laboratorio y presentar resultados interpretables. El autor ejecutó sus propias verificaciones, sin revisión cruzada de código.

## Cambios

- `src/app/analyzeMeasurements.ts`: adaptador del conjunto simulado a observaciones que contienen exclusivamente `timeDays` y `observedFlux` renombrado a `flux`; llamada al detector existente con `DEFAULT_DETECTION_OPTIONS`. No se envían escenario, radios, período verdadero, semilla, sigma verdadero o flujo limpio.
- `src/app/App.tsx`: botón conectado mediante el panel, estado de resultado y error; regenerar un escenario válido o introducir uno inválido retira resultados y errores anteriores. Un error del análisis se presenta explícitamente. Ejecutar análisis no reinicia, pausa, reproduce ni regenera mediciones.
- `src/components/DetectionPanel.tsx`: estados en español, cantidad de eventos, centros, intervalos, duración bajo umbral, profundidad en flujo normalizado y ppm, muestras por evento, período estimado o explicación de ausencia y advertencias. No se presentan probabilidades ni confirmación planetaria. La duración sobre umbral se distingue de la duración física completa.
- `src/styles/laboratory.css`: disposición adaptable y legible de los eventos, énfasis del estado y advertencias, conservando el diseño del laboratorio.
- `tests/ui/detection.test.tsx`: cuatro pruebas de adaptador y panel. Una curva ideal con disminuciones y mediciones constantes no produce candidatos; mediciones con tres caídas periódicas sí los producen aunque la curva ideal sea constante. Se comprueban datos insuficientes, período ausente y errores visibles.
- `tests/ui/detection.check.ts`: tres recorridos Chromium del laboratorio real: detección y conservación de datos/reproducción; invalidación y caso débil sin evidencia; teclado, movimiento reducido y anchos de pantalla.
- `tests/ui/structure.test.tsx` y `tests/ui/controls.check.ts`: expectativas actualizadas para el botón real, conservando la ausencia de resultados antes de ejecutar la búsqueda.
- `tests/ui/synchronized.check.ts`: únicamente se redirigen las capturas de las regresiones de sincronización al directorio de evidencia T401 para conservar el historial T202.

## Verificaciones ejecutadas

Versión final:

- `npm run lint`: aprobado; sin advertencias y sin comentarios de código.
- `npm run typecheck`: aprobado.
- `node node_modules/vitest/vitest.mjs run`: 14 archivos y 222 pruebas aprobados.
- `node node_modules/vitest/vitest.mjs run --config tests/ui/browser.config.ts`: 3 archivos y 7 recorridos Chromium aprobados.
- `npm run build`: aprobado; 33 módulos transformados. Resultado Vite: JavaScript 242,37 kB, 76,52 kB gzip; CSS 3,31 kB, 1,30 kB gzip. Los cambios posteriores fueron de pruebas y ubicación de capturas, sin modificación de código de producción.

El recorrido real comprobó cinco eventos y período estimado de cinco días para el escenario inicial. También comprobó que cambiar a radio planetario 1 y ruido 5000 produce el estado sin evidencia para la semilla inicial, sin concluir ausencia de planeta. Los resultados y los dos trazados permanecieron iguales durante reproducción, pausa y reinicio temporal. Se comprobó ausencia de desbordamiento de página a anchos 180, 360 y 1280 píxeles.

Incidencias durante la verificación, resueltas o delimitadas:

- El primer intento de Vitest con permisos restringidos no pudo escribir su archivo temporal en `node_modules/.vite-temp` (EPERM). Se repitieron los controles con la ejecución autorizada y finalizaron correctamente.
- La primera prueba nueva de análisis durante reproducción comparó tiempos con un reloj de prueba aún avanzando entre acciones; falló esa expectativa. Se detuvo explícitamente el reloj de prueba y se avanzó sólo mediante el control de reloj. No se modificó la reproducción de producción para hacer pasar la prueba. La suite de navegador posterior aprobó los siete recorridos.
- La primera ejecución de las regresiones existentes regeneró `agents/evidence/T202/desktop.png` y `mobile.png`. Producción fue informada y restaurará esos dos archivos históricos desde HEAD; no deben incorporarse a T401. Las siguientes ejecuciones ya escriben exclusivamente en evidencia T401.

## Evidencias

- `agents/evidence/T401/analysis-desktop.png`.
- `agents/evidence/T401/analysis-mobile.png`.
- `agents/evidence/T401/synchronized-desktop.png`.
- `agents/evidence/T401/synchronized-mobile.png`.

Se inspeccionó visualmente la captura móvil del análisis. La entrega no contiene una afirmación de compatibilidad exhaustiva con lectores de pantalla ni de validación científica profesional del detector.

## Entradas principales para T402

1. Abrir `/AstroDetect/`, activar «Buscar posibles tránsitos» y observar el estado y la lista «Eventos candidatos». Región de resultados: `data-testid="detection-results"`; encabezado de sección: `#interpretacion`.
2. Usar `#starRadiusSolar`, `#planetRadiusEarth`, `#periodDays`, `#noisePpm` y `#seed`: cualquier cambio retira resultados. Una entrada inválida deshabilita búsqueda y suspende observación/curva hasta corregirla.
3. Reproducir, pausar, mover `#simulation-time` o volver al inicio conserva la serie y el análisis. Un análisis ejecutado durante reproducción conserva el estado de reproducción y el tiempo vigente.
4. «Restablecer configuración» invalida resultados y regenera el escenario inicial. El botón no necesita un backend ni red para calcular.
5. Las advertencias proceden del detector, ya están en español y se muestran sin alterar su significado. Un período `null` tiene explicación visible. Los flujos insuficientes y errores del panel tienen cobertura de componente; el laboratorio de v0.1 siempre genera la serie completa de 5001 muestras.

Puerto usado por las pruebas nuevas: 4190; los servidores y navegadores de prueba se cerraron al finalizar. No se ejecutarán más recorridos durante T402 desde esta asignación.

## Límites y siguiente responsable

No se implementó v0.2, retos desconocidos, exportación, parámetros adicionales, marcadores nuevos en la curva, servicios externos ni dependencias. No se modificaron motor, detector o contratos. La aplicación muestra candidatos y limitaciones, sin asegurar descubrimientos ni eficacia pedagógica medida.

Producción conserva la publicación de la entrega, la restauración de las dos capturas históricas y la asignación de T402. Para revertir T401, producción puede retirar los dos módulos nuevos y recuperar los archivos modificados desde la base registrada; no se ejecutó una reversión. El autor entrega los archivos y se detiene.
