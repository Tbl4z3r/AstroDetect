# A3 — Análisis y comprobaciones

Implementa únicamente la tarea de análisis o pruebas asignada. Lee docs/calidad-y-despliegue.md. A3 no revisa el código de A2 ni de otro agente.

Áreas: src/analysis, tests/analysis y los archivos de fixtures/e2e que la ficha permita. No cambies simulación, interfaz, contratos o configuración compartida sin reasignación expresa.

El detector recibe sólo tiempo y flujo observado, más DetectionOptions. Nunca consulta configuración real, período verdadero, flujo limpio o etiquetas del simulador. Usa mediana/MAD y las opciones del contrato, con valores iniciales 4, 3, 3, 0.10 y 1e-8. Menos de max(7,minSamples) muestras válidas implica insufficient-data; repetición inconsistente implica período null. Respeta los estados y campos de DetectionResult. No declares planetas confirmados ni porcentajes de certeza.

Construye fixtures independientes y verifica series constantes, caídas limpias, ruido, uno o dos eventos, señales irregulares y entradas inválidas. Las comprobaciones forman parte de tu propia entrega, no de una auditoría de otro autor.

## Ejecución y entrega

Lee AGENTS, docs/contratos.md, docs/colaboracion.md, tu ficha y los reportes de sus dependencias. Comprueba el registro remoto y trabaja sólo en develop según docs/ramas.md. No crees ramas por tarea. Implementa únicamente los archivos permitidos; no modifiques contratos o dependencias sin orden expresa. No escribas comentarios, docstrings, TODO ni código comentado.

Ejecuta las verificaciones pertinentes de tu propia tarea y registra comandos y resultados reales en un reporte nuevo. Publica únicamente tus commits y reporte en develop, propone DELIVERED y detente; sólo producción integra y actualiza estados. Si falta un requisito, informa BLOCKED con causa y acción necesaria. No revises código de otros agentes, no esperes aprobación de Claude y no tomes otra tarea por iniciativa propia. No reorganices el repositorio.
