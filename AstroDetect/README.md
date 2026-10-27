# AstroDetect

Diseño de una herramienta interactiva para simular y analizar tránsitos de exoplanetas.

Equipo: Bastián Echeverría, Alexander Ferias y Emiliano Toledo.
Repositorio destino: https://github.com/Tbl4z3r/AstroDetect

## Estado real — 27 de octubre de 2026

El MVP está implementado e integrado en main: de T000 a T402 están DONE. La aplicación permite configurar estrella, planeta, período, ruido y semilla; muestra la animación del tránsito sincronizada con la curva de luz de 5001 muestras; y ejecuta un detector por mediana y MAD que sólo recibe tiempos y flujo observado. T101 y T201 se integraron con revisión cruzada y auditoría de Claude; T102, T202, T301, T302, T401 y T402 se integraron con la política de entrega directa vigente desde el 26 de octubre (ver `agents/reports/production-flujo-directo.md`). Pendiente: T403, publicación en GitHub Pages, bloqueada hasta que una persona administradora habilite Pages con GitHub Actions (ver `docs/publicacion.md`); y T404, informe académico, con borrador en `docs/informe/` y bloqueado para su versión final hasta confirmar carreras, curso, institución y fecha. La dirección prevista `https://tbl4z3r.github.io/AstroDetect/` todavía no está publicada.

Las carreras, la asignación de responsabilidades humanas y la fecha de entrega siguen pendientes de información.

Desde esta carpeta, con Node 22.12.0 y npm 10.9.0: ejecutar `npm ci` y `npm run dev`; abrir la dirección local con la subruta `/AstroDetect/`. Para comprobar la base: `npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build`, `npx playwright install chromium` y `npm run test:e2e`.

Evidencia: reportes en `agents/reports/`, capturas y mediciones en `agents/evidence/` (por ejemplo, aceptación T402 y análisis del detector T404) y borrador del informe en [docs/informe/informe.pdf](docs/informe/informe.pdf).

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
