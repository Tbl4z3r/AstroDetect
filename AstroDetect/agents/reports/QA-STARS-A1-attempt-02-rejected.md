# QA estelar — A1 — Intento 02 no aprobado

- Fecha: 2 de noviembre de 2026, América/Santiago.
- Encargo: pruebas intensivas, corrección y promoción a main después de aprobar QA, según aclaración expresa del usuario. Production permanece fuera de alcance.
- Candidata: `1d087ffc8b6b2a4908951b05d2d356fa80c16caf`, develop y qa. Main sigue en `b86ed2613d1d8f1389e4adada6b248be5e3a3a7d`.
- Autor: A1, rol temporal de tester. Dictamen: no aprobada; no se integra a main.
- Reporte anterior: [rechazo inicial](QA-STARS-A1-attempt-01-rejected.md).

Las correcciones de icono y liberación de contexto están implementadas. Lint y build aprobados. La regresión que fallaba por exceso de contextos pasó junto a las otras dos pruebas dirigidas: 3/3 en 17,0 s, sin retirar su expectativa de cero avisos.

La instalación limpia de esta ronda agregó 197 paquetes, auditó 198 en 15 s y mantuvo los 11 avisos moderados de desarrollo. Lint, tipos, 318 pruebas unitarias en 17 archivos (2,42 s) y build de 47 módulos (475 ms) pasaron. La suite UI paralela dio 6/7 y un timeout de 30 s en el recorrido de reloj y reproducción. No se cambió su límite ni se declara aprobada; debe repetirse con el entorno sin las matrices externas concurrentes y registrar el resultado.

La [CI de qa falló](https://github.com/Tbl4z3r/AstroDetect/actions/runs/41509816214): E2E dio 21 aprobados, 1 fallido y 1 no ejecutado. El fallo es el foco esperado sobre «Modelo de estrella» inmediatamente después de activar el enlace de salto y pulsar Tab. Los logs del job 125498440311 confirman el fallo de esa aserción; el resto de controles previos pasó.

El enlace de salto programa el foco del encabezado de configuración para el siguiente frame, después de abrir el panel móvil. El test no esperaba ese foco intermedio: podía pulsar Tab antes del frame y recibir luego el foco del encabezado. Se requiere sincronizar el recorrido con una aserción de foco sobre el encabezado antes de Tab, manteniendo la posterior aserción del selector y del campo. No se fuerza el foco en la prueba ni se amplían esperas para aceptar un estado incorrecto.

Se cierra esta ronda de tester sin aprobación. La continuación autorizada es corregir la sincronización del test en develop, publicar una nueva candidata en qa, completar la batería y las matrices sobre ese commit y aprobar sólo cuando CI termine correctamente. No se modifican contratos, dependencias, configuración o registro. Los resultados iniciales completos de las matrices externas se conservarán en la entrega final, identificando sus candidatas.
