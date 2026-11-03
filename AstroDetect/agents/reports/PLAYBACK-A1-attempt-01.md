# Reproducción explícita con movimiento reducido — A1 — Intento 01

- Fecha y tarea: 2 de noviembre de 2026, América/Santiago. Encargo directo del usuario: hacer funcionar el botón Reproducir.
- Estado sugerido: DELIVERED.
- Autor: A1, corrección de interfaz asignada expresamente por el usuario; no se toma otra tarea del backlog.
- Base y rama: `197cbd431af13844d88b289a51fe1dd27d691c7b`, develop. Las cuatro ramas remotas coincidían en esa base al comenzar; se volvieron a consultar antes del commit.
- Referencia de código: [d400c14407faf9fe6367a2477a22afb4f0b54107](https://github.com/Tbl4z3r/AstroDetect/commit/d400c14407faf9fe6367a2477a22afb4f0b54107).
- Reporte previo de la versión base: [QA-STARS-A1-attempt-03.md](QA-STARS-A1-attempt-03.md).
- Contratos y dependencias: conservados. Sin cambios de fórmulas, detector, datos, dependencias, configuración compartida, versiones o registro de tareas.

## Alcance realizado

La página pública reproducía el problema: con la preferencia del sistema de movimiento reducido, Reproducir estaba deshabilitado. El hook también vetaba el avance del reloj con esa preferencia. Era una restricción de la interfaz, no un fallo del modelo orbital.

Se permite la reproducción iniciada expresamente por el usuario con cualquiera de las dos preferencias. La aplicación sigue comenzando en pausa y se detiene si el sistema activa movimiento reducido durante la reproducción. Desactivar esa preferencia no inicia la simulación por sí solo. Se conserva el avance manual y la supresión de la rotación decorativa de la estrella. El mensaje de ayuda explica la nueva conducta.

Archivos de código y pruebas:

- `src/app/usePlayback.ts`: retira el veto del reloj, manteniendo la pausa al cambiar la preferencia.
- `src/components/PlaybackControls.tsx`: habilita el botón y actualiza su explicación.
- `tests/e2e/playback.spec.ts`: tres regresiones sobre reproducción explícita, teclado, pausa, reanudación, inicio desde el extremo final, sincronización de tiempo y cambio de imagen 3D, conservación de curva, semilla y detector, cambios de preferencia y pausa por Guía. Se prueban escritorio y 360 px.
- `tests/e2e/acceptance.spec.ts` y `tests/ui/synchronized.check.ts`: actualizan la expectativa antigua de botón bloqueado; conservan las verificaciones de teclado, pausa y avance manual.

Evidencia nueva: [escritorio](../evidence/PLAYBACK-2026-11-02/desktop.png) y [móvil](../evidence/PLAYBACK-2026-11-02/mobile.png), capturadas por los recorridos UI con movimiento reducido. Los archivos históricos regenerados por las pruebas se restauraron a su contenido previo; sólo se agregan estas copias nuevas.

## Verificaciones propias

Entorno local Windows, Node 22.12.0, npm 10.9.0 y Chromium de Playwright, con los paquetes previamente instalados del lockfile. No se realizó npm ci local en esta ronda; el workflow de develop lo ejecuta de forma independiente.

| Verificación | Resultado real |
| --- | --- |
| Nueva regresión antes de la corrección | Dos fallos por botón deshabilitado con movimiento reducido y un caso sin esa preferencia aprobado; 24,2 s |
| `npm run build` | Aprobado: 47 módulos, 393 ms |
| `npm run test:e2e -- tests/e2e/playback.spec.ts --workers=1` | 3/3 aprobadas tras la corrección; 20,1 s |
| `npm run lint` | Aprobado, incluido control de ausencia de comentarios |
| `npm run typecheck` | Aprobado |
| `npm test -- --run` | 318/318 pruebas, 17 archivos; 2,31 s |
| `npm run test:e2e -- --workers=4` | 26/26 recorridos completos; 31,7 s |
| `vitest run --config tests/ui/browser.config.ts` | 7/7 recorridos, 3 archivos; 9,96 s |
| Navegador lateral sobre preview local 4182 | Movimiento reducido activo; clic en Reproducir cambió a Pausar y avanzó el tiempo de 0; Pausar detuvo el reloj y devolvió Reproducir |
| `git diff --check` | Aprobado |

El aviso previo de tamaño del módulo 3D sigue presente durante build. No se alteran sus límites ni configuración para ocultarlo. Los dos fallos iniciales se conservan aquí como reproducción del defecto, no se declaran aprobados.

## Límites y continuidad

Entrega en develop. No se promueve este arreglo a qa, main ni production y no se dispara una publicación como parte de este encargo; se respeta el flujo acordado de ramas. Producción decide la promoción y el cierre de registro. La página pública seguirá con el comportamiento anterior hasta publicar esta corrección.

Validación en Chromium local; no se declara prueba en dispositivos físicos ni en otros motores de navegador. La reproducción modifica únicamente el tiempo mostrado, conservando cálculos y mediciones. Una reversión debe ser un commit nuevo, sin reescribir historial. El autor se detiene al entregar este arreglo.
