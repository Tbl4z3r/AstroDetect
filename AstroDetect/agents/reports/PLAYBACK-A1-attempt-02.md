# Reproducción explícita — A1 — Intento 02 y QA

- Fecha y tarea: 2 de noviembre de 2026, América/Santiago. Corrección del botón Reproducir asignada directamente por el usuario.
- Estado sugerido: DELIVERED. Dictamen de producto: APTA para main tras QA satisfactoria.
- Autor: A1. No se toma otra tarea ni se modifica el registro compartido.
- Base común: `197cbd431af13844d88b289a51fe1dd27d691c7b`. Trabajo en develop y candidata probada en qa.
- Referencia del código probado: [dfce36cc73f86edbd40babed116544798e280a01](https://github.com/Tbl4z3r/AstroDetect/commit/dfce36cc73f86edbd40babed116544798e280a01). Cambio funcional: [d400c14407faf9fe6367a2477a22afb4f0b54107](https://github.com/Tbl4z3r/AstroDetect/commit/d400c14407faf9fe6367a2477a22afb4f0b54107).
- Reporte previo conservado: [PLAYBACK-A1-attempt-01.md](PLAYBACK-A1-attempt-01.md).
- Autorización recibida después del primer reporte: «Pasar por QA e integrar a main para que Claude la revise». Esta instrucción permite las promociones hasta main; no autoriza publicar en production ni enviar mensajes a Claude.
- Contratos, fórmulas, datos, detector, dependencias, configuración y versiones conservados.

## Alcance y corrección de la prueba

El arreglo permite iniciar expresamente la simulación con movimiento reducido. Se mantiene la pausa inicial, la pausa al activar esa preferencia, la pausa al abrir Guía, el avance manual y la sincronización entre planeta y curva. La reproducción no regenera ruido ni borra la detección. Véase el detalle de archivos y evidencia del primer reporte.

La [primera CI de develop](https://github.com/Tbl4z3r/AstroDetect/actions/runs/41553798173), sobre `6ea8d989218fea81ba8c8020a1d42ce216c6889a`, terminó con 25/26 recorridos aprobados. El recorrido restante falló preparando su reloj: `clock.pauseAt: Cannot fast-forward to the past`. La prueba instalaba el reloj y después intentaba pausarlo usando otra lectura del tiempo real; el orden entre las dos llamadas podía producir un instante pasado en el navegador remoto.

Se corrige exclusivamente `tests/e2e/playback.spec.ts`: instalación con instante fijo y pausa un segundo después de ese instante. No se cambian límites de espera, aserciones ni la aplicación. Las verificaciones de reproducción con ambas preferencias, cambio de preferencia durante reproducción, pausa por Guía y conservación de datos siguen activas. Esta corrección de prueba es el commit dfce36c.

## Verificaciones reales

| Verificación | Resultado |
| --- | --- |
| Regresión antes del arreglo funcional | Dos fallos por botón bloqueado y un caso sin movimiento reducido aprobado; conservado en el intento 01 |
| Lint tras corregir el reloj de prueba | Aprobado, incluido control sin comentarios de código |
| Typecheck tras corregir el reloj de prueba | Aprobado |
| Batería completa local tras corregir el reloj | 26/26 E2E aprobados, cuatro workers, 33,5 s |
| Pruebas de cálculo del código funcional | 318/318, 17 archivos, 2,31 s; la corrección posterior sólo cambia la preparación de una prueba E2E |
| Recorridos UI del código funcional | 7/7, tres archivos, 9,96 s; mismo código de aplicación que la candidata final |
| Build del código funcional | 47 módulos, 393 ms; mismo código de aplicación que la candidata final |
| QA remota sobre dfce36c | [AstroDetect checks: success](https://github.com/Tbl4z3r/AstroDetect/actions/runs/41554373862), incluida instalación limpia, lint, tipos, pruebas unitarias, build y recorridos E2E |
| Navegador lateral local | Pulsación real de Reproducir con movimiento reducido activo avanzó el reloj y cambió el botón a Pausar; Pausar detuvo la simulación |
| Copia local | Sin trabajo ajeno incorporado; evidencia histórica regenerada por los tests restaurada a su contenido previo |

Evidencia visual del mismo código funcional: [escritorio](../evidence/PLAYBACK-2026-11-02/desktop.png) y [móvil](../evidence/PLAYBACK-2026-11-02/mobile.png). La primera CI fallida permanece enlazada y no se cuenta como una aprobación.

## Entrega y límites

Este reporte se agrega con un commit documental, conservando intactos src, tests, dependencias y configuración respecto de la candidata dfce36c ya aprobada. Se publican develop y qa y se comprueba la CI del commit final antes de integrar a main con avance rápido. El resultado final y su ejecución se consultan en el historial de main y en GitHub Actions.

Production queda fuera de la autorización. La web pública conserva el comportamiento anterior hasta que el coordinador decida publicar. Claude podrá consultar el código y estos reportes en main; no se envía un mensaje en su nombre. No se marca DONE en el backlog.

Pruebas de navegador realizadas en Chromium local y en el runner de GitHub; sin certificación de otros motores o dispositivos físicos. Persiste el aviso conocido de tamaño del módulo 3D durante build. No se modifican configuraciones para ocultarlo. Cualquier reversión será un nuevo commit, sin reescribir ramas. El autor se detiene al completar la entrega hasta main.
