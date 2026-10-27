# Asignaciones de la siguiente ronda

Política vigente: sin revisión cruzada ni auditoría de Claude. Cada autor verifica su propia entrega, publica reporte y propone DELIVERED. Producción integra y registra DONE. No reorganizar el repositorio durante estas tareas.

## Compañero 1 — T301 — Detector básico

- Rol funcional para esta tarea: A3. La asignación previa de esta persona como A1 no obliga a conservar esa especialidad.
- Rama exclusiva: task/T301, reservada por producción para esta asignación.
- Dependencia: T000 DONE.
- Instrucción: agents/instructions/03-analisis-calidad.md.
- Ficha: agents/tasks/T301.md.
- Escritura: src/analysis, tests/analysis y su propio reporte/evidencia.
- Resultado: detectTransits según el contrato, sin usar datos verdaderos del simulador; fixtures y verificaciones propios.

No implementar T302, interfaz, simulación o revisión de tareas ajenas.

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

Producción asignará T302 y T401 cuando sus dependencias estén integradas. La organización general del repositorio queda para después de esta ronda.
