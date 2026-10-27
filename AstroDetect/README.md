# AstroDetect

Diseño de una herramienta interactiva para simular y analizar tránsitos de exoplanetas.

Equipo: Bastián Echeverría, Alexander Ferias y Emiliano Toledo.
Repositorio destino: https://github.com/Tbl4z3r/AstroDetect

## Estado real — 26 de octubre de 2026

T000 está DONE: base React + TypeScript + Vite ejecutable, contratos compartidos v1 y controles de instalación, lint, tipos, pruebas, build y arranque en Chromium. La entrega fue aprobada por A3 e integrada en main mediante el PR #1, con CI aprobada también después de la integración. T101 está DONE: geometría orbital y flujo ideal integrados mediante el PR #3, con revisión A2 y auditoría de Claude aprobadas sobre `e7a9bca`. T201 está DONE: controles y estructura accesible integrados mediante el PR #4, con revisión A3 y auditoría de Claude aprobadas sobre `5f4f6df`. T102 está DONE: serie temporal y ruido reproducible integrados desde el PR #9. T202 y T302 están DONE mediante PR #12 y PR #11; T301 está DONE mediante PR #10. Las tareas se entregan sin revisión cruzada ni auditoría. T401 está READY y pendiente de asignación tras organizar el repositorio. El detector básico está implementado (T301); su conexión a la interfaz corresponde a T401. No hay despliegue.

El código de T000 está integrado en main desde `c30aed6f45f3e969189136c50ca6a2c69c2004d2`. Para comenzar las tareas READY, actualizar main y registrar su SHA real con este cierre incluido. Las carreras, asignación de responsabilidades humanas y fecha de entrega siguen pendientes de información.

Desde esta carpeta, con Node 22.12.0 y npm 10.9.0: ejecutar `npm ci` y `npm run dev`; abrir la dirección local con la subruta `/AstroDetect/`. Para comprobar la base: `npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build`, `npx playwright install chromium` y `npm run test:e2e`.

Entrega y evidencia: [cierre de producción de T000, intento 04](agents/reports/T000-PRODUCTOR-attempt-04.md). La pantalla ya ofrece controles, animación y curvas sincronizadas; el botón y los resultados del detector se conectarán en T401.

## Empezar

1. Leer [plan de producción](docs/plan-produccion.md), [reglas generales](AGENTS.md) y [protocolo de colaboración](docs/colaboracion.md).
2. El productor asigna una sola tarea cuyo estado sea READY; consultar [registro](agents/tasks/backlog.json) y las fichas individuales.
3. Entregar al agente su [instrucción de rol](agents/instructions/) más el ID de tarea, base de trabajo y archivos autorizados.
4. Al terminar, crear un reporte en `agents/reports/`; el agente propone DELIVERED y se detiene, sin revisión cruzada ni auditoría.
5. Sólo el productor integra y declara DONE después de la entrega y las verificaciones requeridas.

Roles: A1 ciencia y simulación, A2 interfaz educativa, A3 análisis y calidad. El productor conserva contratos, configuración compartida, registro y releases. Ningún rol corresponde automáticamente a uno de los estudiantes.

## Documentación

- [Arquitectura](docs/arquitectura.md) y [contratos de integración](docs/contratos.md).
- [Modelo científico](docs/modelo-cientifico.md).
- [Experiencia educativa](docs/experiencia-educativa.md).
- [Calidad y publicación](docs/calidad-y-despliegue.md).
- [Informe universitario](docs/informe-academico.md).
- [Fuentes consultadas](docs/fuentes.md).
- [Cómo incorporar este paquete al repositorio](docs/incorporar-a-github.md).
- [Historial](CHANGELOG.md).

El alcance v0.1 es una estrella, un planeta, órbita circular, radios y período ajustables, animación, curva con ruido y detección elemental. Los casos desconocidos se reservan para v0.2.

GitHub Pages es la opción prevista: el sitio entrega archivos estáticos y cada navegador hace sus propios cálculos. Es una elección razonable para unas diez personas independientes, pendiente de probar rendimiento y despliegue. No hay cuentas, servidor de cálculo, API de IA ni cobros por usuario.

La ausencia de fines de lucro no define una licencia de distribución. El equipo deberá decidir la licencia antes de una release reutilizable; no se ha añadido una licencia por suposición.

## Cambio de flujo vigente

El equipo retiró la revisión cruzada y la auditoría obligatoria de Claude. Se mantienen contratos, verificaciones del autor, asignación única y cierre de producción. Las menciones a revisiones ya realizadas en estados históricos no vuelven a activarlas. No se reorganizan archivos ni carpetas en esta ronda. Consulta agents/tasks/asignaciones-actuales.md para los siguientes trabajos.
