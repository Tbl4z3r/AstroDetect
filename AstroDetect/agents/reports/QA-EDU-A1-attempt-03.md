# QA educativa y recuperación 3D — A1 — Intento 03

- Fecha, tarea y versión: 2 de noviembre de 2026, América/Santiago. Asignación directa del usuario: probar la entrega educativa, rechazar candidatas defectuosas, corregir, repetir QA e integrar a main. Incluye el aviso posterior de simulación 3D ausente. No se inicia otra tarea del backlog.
- Estado sugerido: DELIVERED. Dictamen de producto: APTA para integrar qa a main; production queda pendiente de una asignación posterior.
- Autor y persona asignada: A1. Se separaron rondas de tester y correcciones de autor; se conservan los dos rechazos previos.
- Base de main: `25a3276901066cf8ed46064810924d1368033008`. Ramas de trabajo y candidata: develop y qa.
- Referencia de código probada: [`4a7ae4f94dce831e5c27cc61fba5538551b972d3`](https://github.com/Tbl4z3r/AstroDetect/commit/4a7ae4f94dce831e5c27cc61fba5538551b972d3).
- Referencias anteriores: entrega educativa `830f8470206f88da5837bd6b705e1b37150ac879`; correcciones de operandos y guía `509e48e44d47a4a748c9dac783c5a2ada9457fca`.
- Reportes previos: [entrega](EDU-guia-y-formulas-A1-attempt-01.md), [rechazo 01](QA-EDU-A1-attempt-01-rejected.md) y [rechazo 02](QA-EDU-A1-attempt-02-rejected.md).
- Contratos y dependencias: conservados, junto a motores científicos, detector, configuración compartida, versiones y registro de tareas. Reglas de colaboración y cuatro ramas consultadas directamente antes de actuar; promoción hasta main autorizada por el usuario.

## Alcance y defectos resueltos

EDU-QA-01: las sustituciones matemáticas conservan los operandos aceptados por la aplicación. Los resultados redondeados se presentan como aproximaciones; las conversiones y la sustitución de Kepler usan cifras coherentes. Se incluyen valores de precisión extrema y expectativas aritméticas independientes. La regresión de formato dio un fallo antes de la corrección y pasa después; no se cambió el motor físico.

EDU-QA-02: la guía vuelve a situar su objetivo en el área visible al redimensionar o desplazar la página, separado del caption. Se verifican foco, cierre, restauración de vista, conservación del experimento y ausencia de bucle de scroll. El resaltado ya no acepta una línea de 8 px como prueba suficiente del objetivo.

EDU-QA-03: el canvas se redibuja al cambiar de tamaño, incluso cuando el recorrido ha detenido el render continuo. Cambiar cámara o cuerpos también actualiza la imagen necesaria. No se reanuda la reproducción durante la guía ni se modifican tiempos o mediciones. La regresión de imagen falló sobre 509e48e con cero píxeles cálidos de la estrella; con la corrección exige y obtiene más de 100, además de comprobar que la cámara cambia la imagen sin cambiar los datos.

La vista 3D distingue ahora fallo de descarga e inicio gráfico. Un módulo no descargado ofrece «Recargar la página», indicando que restablece el experimento. Un fallo al iniciar WebGL ofrece «Reintentar vista 3D», conservando parámetros, tiempo y curva. Se fuerzan ambos fallos en pruebas independientes y se verifica su recuperación. Se mantiene la recuperación existente ante pérdida temporal del contexto. La causa original del aviso visto en la pestaña del usuario no quedó trazada; se comprobó que recargar con el preview disponible devolvía la escena, sin atribuirle una causa gráfica no demostrada.

Archivos de las correcciones: `src/components/experimentMath.ts`, `ScienceGuide.tsx`, `GuidedTour.tsx`, `Orbit3D.tsx`, `orbitScene.ts`; `tests/ui/experiment-math.test.tsx`; `tests/e2e/learning.spec.ts`, `guide.spec.ts`, `orbit-rendering.spec.ts`. Este reporte y su evidencia son archivos nuevos; los reportes históricos no se sobrescriben.

## Verificaciones ejecutadas sobre 4a7ae4f

Entorno local: Windows, Node 22.12.0, npm 10.9.0, Chromium de Playwright. Preview compilado en 4182, preview E2E independiente en 4173. Las comprobaciones de imagen analizan capturas reales del canvas, sin duplicar el renderizador ni aceptar únicamente su existencia en el DOM.

| Control | Resultado real |
|---|---|
| npm ci | Aprobado: 197 paquetes instalados, 198 auditados, 9 s |
| npm run lint | Aprobado, incluido el control de comentarios |
| npm run typecheck | Aprobado |
| npm test -- --run | 16 archivos, 232 pruebas aprobadas, 2,41 s |
| npm run build | Aprobado: 46 módulos, 405 ms |
| npx vitest run --config tests/ui/browser.config.ts | Repetición completa aprobada: 3 archivos, 7 recorridos, 9,42 s |
| npm run test:e2e | 19 recorridos aprobados, 17,5 s, incluidos los cuatro nuevos de imagen y recuperación 3D |
| Matriz exploratoria de precisión | 8/8 aprobados, 32 combinaciones de límites, dos casos de doble precisión, cero errores de página |
| Matriz exploratoria de guía | 12/12 recorridos y 6/6 escenarios de tamaño y desplazamiento aprobados |
| Diez contextos concurrentes | Aprobados, 4.922 ms en total; cero errores por sesión |
| npm audit --omit=dev --json | Cero avisos en dependencias de ejecución |
| CI de qa para 4a7ae4f | [AstroDetect checks: success](https://github.com/Tbl4z3r/AstroDetect/actions/runs/41471190849), incluida instalación limpia, lint, tipos, unitarias, build y E2E |

Se registra también una ejecución local fallida: el primer intento de la suite de interfaz tuvo un timeout de 10 s en el hook de preparación de la primera página de detección; las otras seis pruebas pasaron. Se repitió la suite completa con el mismo código, expectativas y límites, resultando 7/7. No se ocultó el fallo, amplió el timeout ni desactivó una validación. El E2E completo pasó a continuación. No se reproducía un defecto de producto en los recorridos posteriores; este incidente queda como límite de estabilidad del entorno de pruebas.

Las verificaciones independientes incluyen cinco centros delanteros y seis posiciones traseras, 5.001 puntos, profundidad calculada a partir de radios y unidades, valores extremos, entradas inválidas y recuperación, última muestra, ruido diminuto, semilla, detector y conservación de serie/reloj. Para el caso de radios 1 R☉ y 10 R⊕, la referencia es `1 − (10 × 6378100 / 695700000)² = 0,9915949821227747`; la lectura de la curva difiere menos de 10⁻⁶ por su presentación. No se infiere la expectativa a partir de la función bajo prueba.

La comprobación visual confirma estrella y órbita renderizadas durante la guía en escritorio y móvil; el planeta se verifica al girar la cámara en la vista normal. La cámara de exploración no cambia la línea de visión de la curva. En el instante inicial, el planeta está detrás de la estrella y puede quedar oculto desde la cámara centrada: esa ocultación corresponde al escenario, no a una escena 3D ausente.

## Evidencia, límites y continuidad

[Evidencia final](../evidence/QA-EDU-2026-11-02/attempt-03/) contiene matrices, capturas y resultados de comprobación. Los archivos T401/T402 regenerados por las pruebas se copian cuando aportan evidencia y se restauran a su contenido histórico antes del commit.

Se conservan los 11 avisos moderados de herramientas de desarrollo y la advertencia de tamaño del módulo 3D de unos 512 kB; no se cambian dependencias ni se declaran resueltos. La auditoría de ejecución da cero avisos. Esta ronda usa Chromium local y CI Linux, sin certificación de Safari, Firefox, dispositivos físicos, accesibilidad integral ni capacidad del sitio público.

Se termina el rol temporal de tester con la candidata 4a7ae4f apta. El commit posterior de este reporte y evidencia conserva exactamente el mismo código y debe pasar CI en qa antes de su promoción por avance rápido a main. Revalidar referencias remotas y ascendencia; ante trabajo divergente, detener la promoción sin force push. No se promueve production, no se despliega, no se contacta a Claude y no se actualiza el registro ni se declara DONE. La revisión posterior solicitada a Claude y la decisión de publicación quedan en manos del usuario.
