# Asignaciones de la siguiente ronda

Política vigente: sin revisión cruzada ni auditoría de Claude. Cada autor verifica su propia entrega, publica reporte y propone DELIVERED. Producción integra y registra DONE. No reorganizar el repositorio durante estas tareas.

## Compañero 1 — T302 — Casos de integración y límites del detector

- Rol funcional: A3. T301 está DONE; no volver a implementarla.
- Rama exclusiva: task/T302, reservada por producción para esta asignación.
- Dependencias: T102 y T301 DONE.
- Instrucción: agents/instructions/03-analisis-calidad.md.
- Ficha: agents/tasks/T302.md.
- Escritura: tests/fixtures, tests/analysis, tests/simulation/integration.test.ts y reporte/evidencia de T302.
- Resultado: fixtures independientes y casos simulados de señal clara, débil y ruido; resultados reproducibles y límites documentados. No cambiar algoritmos, interfaz, contratos o dependencias.

No realizar revisión de código, no implementar T401 y no reorganizar el repositorio.

## Compañero 2 — T202 — Animación y curva

- Rol funcional: A2.
- Rama exclusiva: task/T202, reservada por producción para esta asignación.
- Dependencias: T102 y T201 DONE. No comenzar si el registro remoto aún no muestra ambas satisfechas.
- Instrucción: agents/instructions/02-interfaz.md.
- Ficha: agents/tasks/T202.md.
- Escritura: archivos de app, componentes, estilos y pruebas UI que la ficha permite, más su reporte/evidencia.
- Resultado: una animación y curva SVG con el mismo reloj y serie real, pausa, reinicio, ruido reproducible y accesibilidad.

No implementar el detector, T401, casos desconocidos, fórmulas científicas duplicadas o una revisión de otro agente.

## Reserva y comienzo

Producción reserva estas ramas antes de compartir los prompts. La persona asignada debe actualizar GitHub, comprobar la asignación y usar su rama existente. Si contiene cambios desconocidos o parece estar trabajando otra persona, detenerse y comunicarlo; no crear otra rama con sufijos ni reemplazar trabajo.

La referencia inicial debe conservar las reglas de flujo 2.0.0 y las dependencias integradas. Registrar en el reporte el SHA real desde el que se comienza.

## Después de entregar

Publicar sólo la rama propia y un PR identificado por tarea, con reporte y resultados reales. El PR es el mecanismo de integración, sin revisión obligatoria de código. Informar a producción el enlace y detenerse. No marcar DONE ni tomar otra tarea.

T302 ya está asignada; producción habilitará T401 cuando T202 y T302 estén DONE. La organización general del repositorio queda para después de esta ronda.
