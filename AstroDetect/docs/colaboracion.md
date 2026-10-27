# Colaboración sin revisión de código

Esta política sustituye la revisión cruzada A1/A2/A3 y la auditoría de Claude. No se requiere un dictamen APPROVED. Se conservan contratos, separación de archivos, pruebas del autor y coordinación de producción.

## Estados

BACKLOG → READY → IN_PROGRESS → DELIVERED → DONE.

BLOCKED significa que falta una dependencia, acceso, decisión o verificación necesaria. Si hay una corrección pendiente, producción puede devolver DELIVERED a IN_PROGRESS con alcance concreto. CANCELLED requiere decisión expresa. REVIEW y CHANGES_REQUESTED dejan de ser estados operativos; sus usos históricos no asignan revisiones nuevas.

READY exige dependencias DONE, alcance definido y una asignación. DELIVERED significa que el autor publicó su cambio, reporte y resultados de las verificaciones requeridas. DONE significa que producción integró la entrega y registró su referencia. Ninguna etapa exige lectura o aprobación del código por otro agente.

## Asignación única y trabajo entre computadores

Producción mantiene agents/tasks/backlog.json: propietario funcional, persona asignada, rama y dependencias. Los roles A1, A2 y A3 son especialidades; una persona puede recibir otro rol en una ronda posterior con asignación explícita.

Una tarea por rama y por persona. Si producción ya reservó una rama y así lo indica el registro, el destinatario usa esa rama; no crea duplicados. Si no está reservada, crearla con una operación que falle si existe. Ante una rama ajena o cambios no reconocidos, detenerse y consultar a producción. Cada computador conserva su copia local.

No elegir tareas libremente ni ejecutar tareas bloqueadas. Un contrato congelado evita implementaciones incompatibles. Todo cambio de contrato o configuración compartida necesita asignación expresa.

## Entrega y cierre

El autor implementa sólo su ficha, ejecuta sus verificaciones y entrega un reporte con base, referencia, archivos, decisiones, comandos/resultados y límites. Publica su rama y un PR identificado por tarea para integrar; un PR es el mecanismo de incorporación y no implica una revisión de código. Propone DELIVERED en el reporte y se detiene.

Producción comprueba los metadatos de la entrega y los controles requeridos, integra en orden de dependencias, registra DONE y habilita las siguientes tareas. Los fallos de pruebas deben resolverse; retirar la revisión no convierte un test fallido o no ejecutado en aprobado. No se hace revisión cruzada ni se espera a Claude.

## Carpetas y memoria

- agents/tasks/: fichas y registro, administrados por producción.
- agents/instructions/: instrucciones por especialidad.
- agents/reports/: un archivo nuevo por entrega e intento, escrito por su autor.
- agents/evidence/Txxx/: evidencia pertinente y pequeña.
- agents/reviews/: historial anterior, sin actividad nueva.

Conservar intentos y referencias, sin sobrescribir reportes ajenos. No limpiar ni mover carpetas, ramas o archivos durante esta ronda. La organización del repositorio se hará después de terminar las tareas.
