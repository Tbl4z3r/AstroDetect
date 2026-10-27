# Flujo actualizado — 2026-10-26

Se retiran revisión cruzada, auditoría de Claude y dictámenes obligatorios. Cada autor conserva sus comprobaciones y entrega DELIVERED; producción integra y registra DONE. Se mantienen la estructura del repositorio, el código y los informes históricos.

## Historial anterior

## Sin publicar — T000

- Base React, TypeScript y Vite; dependencias fijadas y contratos v1 congelados.
- Scripts de instalación y comprobación, control de comentarios por lenguaje y arranque probado en Chromium desde la subruta.
- Workflow de validación sin despliegue. T000 aprobado por A3 e integrado mediante el PR #1; CI del PR y de main aprobadas. Producción registra T000 DONE y habilita T101, T201 y T301 como READY, sin iniciar esas tareas.
- No se implementaron funcionalidades de las tareas de A1, A2 o A3.
- T101: `validateScenario`, `positionAt` y `fluxAt` con órbita circular de Kepler e intersección exacta de discos, integrados mediante el PR #3 (`9ca3d7d`). Revisión A2 y auditoría de Claude aprobadas sobre `e7a9bca`. Producción registra T101 DONE y habilita T102 como READY.
- T201: controles accesibles de los cinco parámetros, estructura educativa y panel de apoyo, integrados mediante el PR #4 (`5e597a1`). Revisión A3 y auditoría de Claude aprobadas sobre `5f4f6df`. Producción registra T201 DONE; T202 espera T102.
- T102, T202, T301, T302, T401 y T402 integrados con entrega directa (PR #9 a #12 y commits de producción hasta `724a687`): serie con ruido reproducible, animación y curva sincronizadas, detector aislado, casos de integración, laboratorio completo y aceptación del MVP. Flujo de publicación preparado sin desplegar (T403).
- T404: borrador del informe académico (10 páginas, Times New Roman 12, interlineado 1,5) con capturas reales y análisis del detector sobre 320 simulaciones; pendiente de datos de portada.

## 0.0.0 — 2026-10-26

### Añadido

- Plan de producción y distribución entre tres roles de IA.
- Reglas persistentes, tareas acotadas y plantillas de entrega y revisión.
- Diseño científico, educativo y de integración del MVP.
- Contratos de datos y criterios de aceptación.
- Ruta de publicación gratuita y estructura del futuro informe académico.

### Estado

Documentación preparada; aplicación, pruebas funcionales y publicación pendientes. Sin cambios subidos al repositorio remoto.
