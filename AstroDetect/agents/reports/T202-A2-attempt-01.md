# Reporte T202 — A2 — Intento 01

- Fecha, tarea y versión: 26 de octubre de 2026; T202, animación y curva sincronizadas; 0.1.0-alpha.
- Estado sugerido: DELIVERED. Producción mantiene el registro, integra y decide DONE.
- Autor y persona asignada: rol funcional A2, companero-2.
- Base y rama: `9886ca1a2f3747aa42871120a051ee14beb6fff0`, `task/T202`, ya reservada por producción y utilizada sin crear una rama alternativa.
- Referencia de código: `f7f74f8cbb56472c99e21fbd9e7ef9f3c76dcf1e`.
- Reporte previo: ninguno de T202. Antecedentes consumidos: reportes T102 y T201; no se reimplementa T201.
- Contratos y dependencias: contrato/modelo 1.0.0; T102 y T201 DONE, comprobados en main remoto actualizado (`38321214664c91aaae74d44b3f431be63c683d72` al comenzar).

## Preparación y alcance autorizado

La copia local estaba limpia en task/T201. Se ejecutó `git fetch origin --prune`, se leyeron las reglas vigentes de main, README, contratos, protocolo, rol 02-interfaz, experiencia educativa, ficha T202, asignaciones actuales y registro. Main asigna T202 a companero-2, rol A2, rama task/T202, reservada por PRODUCCION. La rama reservada era ancestro de main y no contenía cambios desconocidos; se creó únicamente su seguimiento local con `git switch --track origin/task/T202`.

La base reservada conserva flujo 2.0.0 y las dependencias integradas. Los cambios posteriores de main corresponden a T301 y su cierre; no se incorporan algoritmos ajenos en esta entrega. No se modificó ni limpió ninguna otra rama.

La ficha original excluye ScenarioControls.tsx y HelpPanel.tsx. Antes de tocarlos se solicitó una ampliación concreta: conectar los controles existentes y corregir textos que aún decían que no se generaban datos. El usuario autorizó expresamente «Sí, autorizar conexión y textos mínimos». Sólo esos ajustes se añaden al alcance original; no se cambian contratos o dependencias.

## Alcance realizado

- `src/app/App.tsx`: mantiene un único escenario/resultado de simulate y distribuye el mismo tiempo en días a vista y curva. Los cambios válidos regeneran datos y vuelven al inicio en pausa; una entrada inválida suspende ambas vistas, sin usar valores inválidos o presentar la serie anterior como vigente.
- `src/app/usePlayback.ts`: un reloj con requestAnimationFrame, pausa, inicio y búsqueda manual. La serie no forma parte del bucle de reproducción. Comienza pausado, termina al alcanzar la duración y permite volver a reproducir desde cero. Una pestaña detenida no provoca un salto grande al regresar.
- `src/components/TransitAnimation.tsx`: SVG desde el observador, posición obtenida de positionAt, escala común para ambos radios usando PHYSICAL_CONSTANTS y orden de dibujo según inFront. No se duplica geometría orbital ni flujo. El campo es un encuadre local: el planeta puede salir de él y se indica por texto. Se conserva la proporción física de radios y no se comprime artificialmente la posición orbital.
- `src/components/LightCurve.tsx`: curvas limpia y observada, ejes de días/flujo normalizado, leyendas por texto y estilos distintos y cursor con el reloj compartido. Conserva y dibuja las 5001 muestras; no hay reducción ni recorte de valores mayores que uno. La escala vertical se ajusta al rango completo con margen y se declara su ampliación. Los trazados se memorizan por resultado y no se recalculan por cuadro.
- `src/components/PlaybackControls.tsx`: reproducir/pausar, volver al inicio, avanzar una muestra y deslizador accesible en días. Velocidad de visualización explícita: recorrido completo en 30 segundos. Con movimiento reducido se deshabilita la reproducción continua y se conserva el avance manual; activar esa preferencia durante la reproducción la pausa. El reloj no anuncia cada cuadro mediante una región viva.
- `src/components/ScenarioControls.tsx`: conexión mínima del componente existente mediante callback, validación científica consumida desde validateScenario y actualización del texto de regeneración/restablecimiento. Se conserva su validación por campo y límites compartidos.
- `src/components/HelpPanel.tsx`: tres textos pasan de futuro a presente para describir los datos ahora disponibles.
- `src/styles/laboratory.css`: presentación de SVG, leyendas, botones, rango y movimiento reducido, manteniendo el diseño móvil existente.
- `tests/ui/synchronized.test.tsx`: dos comprobaciones estáticas de orden delante/detrás, cursor, extremos de flujo y conservación de todas las muestras de un fixture independiente.
- `tests/ui/synchronized.check.ts`: dos recorridos reales de navegador de sincronización, reproducibilidad, teclado, movimiento reducido y pantalla móvil.
- `tests/ui/browser.config.ts`, `controls.check.ts` y `structure.test.tsx`: incluyen los recorridos nuevos y adaptan selectores/conteos a los controles agregados, manteniendo las verificaciones previas de T201.
- Reporte nuevo y capturas [escritorio](../evidence/T202/desktop.png), [móvil 360px](../evidence/T202/mobile.png), más [resumen de verificaciones](../evidence/T202/verification.json).

## Verificaciones propias

Entorno: Windows/PowerShell, Node 22.12.0, npm 10.9.0, Vitest 5.0.5 y Chromium instalado de Playwright 1.64.1. Comandos desde la subcarpeta de aplicación AstroDetect, con dependencias existentes sin modificar:

- `npm run lint`: aprobado, incluido el control de ausencia de comentarios/docstrings de código.
- `npm run typecheck`: aprobado en TypeScript estricto.
- `npm test -- --run`: aprobado; 10 archivos, 166 pruebas en la base de task/T202. Incluye las pruebas científicas ya existentes sin cambiar sus implementaciones; no es revisión del trabajo de otro agente.
- `npm run build`: aprobado; 30 módulos, HTML 0.42 kB, CSS 2.73 kB y JavaScript 235.73 kB.
- `npx vitest run --config tests/ui/browser.config.ts`: aprobado; dos archivos y cuatro recorridos Chromium (los dos previos más dos de T202).
- `npm run test:e2e`: aprobado; un recorrido Chromium de carga y recarga de la compilación en `/AstroDetect/`, sin fallos de recursos registrados.
- `git diff --cached --check`: aprobado antes del commit de código. Comparación de contratos, simulación, detector, dependencias, registro y workflows: sin cambios.

Los recorridos verifican inicio pausado, avance real de reproducción, igualdad simultánea de reloj en ambos SVG, pausa sin avance, igualdad de los trazados antes/después de reproducir e iniciar, conservación de semilla, posición central en 2.5 días, relación de radios y cursor calculado para ese tiempo. Se comprueba que ruido cero iguala los dos trazados, cambiar semilla cambia sólo la realización observada y restaurar ruido/semilla reproduce exactamente los trazados. Cambiar período durante la reproducción vuelve a cero en pausa; se actualizan duración/cadencia. Una entrada vacía retira ambas vistas hasta corregirla. Se prueban dos combinaciones extremas válidas sin NaN/Infinity.

Teclado: deslizador con Home, ArrowRight y End, foco visible, botón de inicio con Enter y avance por muestra. Movimiento reducido: reproducción continua desactivada, avance manual funcional, cambio de preferencia durante reproducción detiene el reloj y no se reanuda automáticamente. Se comprueba ausencia de desplazamiento horizontal a 360px; los recorridos de T201 conservan además 180 y 1280px. Se inspeccionaron visualmente ambas capturas de la entrega: escala común de radios, curvas, ejes y leyendas visibles, bloques apilados en móvil.

Intentos fallidos y correcciones: el primer recorrido nuevo leyó por separado dos relojes mientras avanzaban, por lo que capturó cuadros distintos; se cambió a una lectura simultánea de ambos atributos en el DOM. El selector previo de status coincidía tanto con el anuncio como con el nuevo output; se acotó al anuncio de restablecimiento. La repetición y la batería final pasaron sin fallos. Un intento de edición del test tuvo un error de comillas de PowerShell, sin cambios ejecutados; se aplicó el parche correctamente. No se cuentan esos intentos como aprobados ni se desactivaron validaciones.

No se repitió instalación limpia: dependencias y lockfile no cambiaron. No ejecutados: otros navegadores, lector de pantalla real, zoom nativo, medición de rendimiento multipersona o publicación. No se afirma CI remota aprobada sin observar su ejecución.

## Límites y continuidad

La detección permanece sin conectar y se informa que no hay resultados: corresponde a T401. Esta entrega no crea resultados que puedan quedar obsoletos. Cada resultado de simulate se conserva completo junto a su escenario; T401 podrá consumir las muestras completas y deberá retirar cualquier detección al sustituir ese resultado. No se conecta ni modifica el detector para anticipar esa tarea.

La vista del tránsito es un encuadre del plano del cielo, no un diagrama orbital completo. El recorrido global dura 30 segundos para todos los períodos; el deslizador y el avance por muestra permiten examinar los tránsitos cortos sin depender de la reproducción. La curva usa escala vertical automática explícita. No se implementan retos desconocidos, exportación, controles científicos nuevos, fórmulas duplicadas ni generación de ruido por cuadro.

Publicar exclusivamente task/T202 con un PR hacia main y este reporte. Producción coordina controles e integración, actualiza el registro y declara DONE cuando corresponda. No se solicitan revisiones cruzadas ni auditorías. A2 propone DELIVERED y se detiene.

Reversión mediante nuevos commits que reviertan sólo esta entrega, sin reescribir historia ni tocar trabajo ajeno. Retomar únicamente con nueva asignación explícita. No hubo merge, despliegue, cambio directo de main ni reorganización del repositorio.
