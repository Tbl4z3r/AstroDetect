# Colaboración sin revisión de código

Esta política sustituye la revisión cruzada A1/A2/A3 y la auditoría de Claude. No se requiere un dictamen APPROVED. Se conservan contratos, separación de archivos, pruebas del autor y coordinación de producción.

Desde el 28 de octubre de 2026 rige el [protocolo de cuatro ramas](ramas.md): develop → qa → main → production. Sustituye cualquier instrucción anterior de crear o reservar una rama por tarea.

## Estados

BACKLOG → READY → IN_PROGRESS → DELIVERED → DONE.

BLOCKED significa que falta una dependencia, acceso, decisión o verificación necesaria. Si hay una corrección pendiente, producción puede devolver DELIVERED a IN_PROGRESS con alcance concreto. CANCELLED requiere decisión expresa. REVIEW y CHANGES_REQUESTED dejan de ser estados operativos; sus usos históricos no asignan revisiones nuevas.

READY exige dependencias DONE, alcance definido y una asignación. DELIVERED significa que el autor publicó su cambio, reporte y resultados de las verificaciones requeridas. DONE significa que producción integró la entrega y registró su referencia. Ninguna etapa exige lectura o aprobación del código por otro agente.

## Asignación única y trabajo entre computadores

Producción mantiene agents/tasks/backlog.json: propietario funcional, persona asignada, archivos, referencia y dependencias. Los roles A1, A2 y A3 son especialidades; una persona puede recibir otro rol en una ronda posterior con asignación explícita. Las ramas de tareas ya cerradas son referencias históricas y no deben recrearse.

Una tarea activa por persona, con archivos separados para evitar colisiones. Cada computador conserva su copia local y trabaja en develop. Actualizar con avance rápido antes de editar; ante cambios desconocidos o divergencias, detener la integración y consultar a producción. No crear ramas remotas adicionales ni usar force push. qa es la candidata de pruebas, main conserva código terminado y production publica el sitio.

No elegir tareas libremente ni ejecutar tareas bloqueadas. Un contrato congelado evita implementaciones incompatibles. Todo cambio de contrato o configuración compartida necesita asignación expresa.

## Entrega y cierre

El autor implementa sólo su ficha, ejecuta sus verificaciones y entrega un reporte con base, referencia, archivos, decisiones, comandos/resultados y límites. Publica sus commits y reporte en develop sin incluir trabajo ajeno; propone DELIVERED y se detiene. No abre una rama adicional. Un PR entre ramas permanentes puede documentar una promoción y no implica una revisión de código.

Producción comprueba los metadatos de la entrega y los controles requeridos, integra en orden de dependencias, registra DONE y habilita las siguientes tareas. Promueve develop a qa, completa las pruebas de la candidata, incorpora el código terminado a main y publica mediante production. Los fallos de pruebas deben resolverse; retirar la revisión no convierte un test fallido o no ejecutado en aprobado. No se hace revisión cruzada ni se espera a Claude.

## Carpetas y memoria

- agents/tasks/: fichas y registro, administrados por producción.
- agents/instructions/: instrucciones por especialidad.
- agents/reports/: un archivo nuevo por entrega e intento, escrito por su autor.
- agents/evidence/Txxx/: evidencia pertinente y pequeña.
- agents/reviews/: historial anterior, sin actividad nueva.

Conservar intentos y referencias, sin sobrescribir reportes ajenos. Las ramas antiguas se archivan durante la organización autorizada del 28 de octubre de 2026, conservando sus commits. No limpiar ni mover archivos o referencias como parte de una tarea distinta.
