# AstroDetect

Diseño de una herramienta interactiva para simular y analizar tránsitos de exoplanetas.

Equipo: Bastián Echeverría, Alexander Ferias y Emiliano Toledo.
Repositorio destino: https://github.com/Tbl4z3r/AstroDetect

## Flujo vigente — 28 de octubre de 2026

Se mantienen sólo cuatro ramas: `develop` para desarrollo, `qa` para pruebas de la candidata, `main` para código terminado y `production` para la versión pública. Sólo production publica GitHub Pages. Consulta el [protocolo de ramas](docs/ramas.md). No crear ramas por tarea ni recrear las archivadas; las menciones siguientes a ramas e integraciones anteriores son historial.

## Estado de la entrega — 27 de octubre de 2026

El MVP está implementado e integrado en main: de T000 a T402 están DONE. La aplicación permite configurar estrella, planeta, período, ruido y semilla; muestra la animación del tránsito sincronizada con la curva de luz de 5001 muestras; y ejecuta un detector por mediana y MAD que sólo recibe tiempos y flujo observado. T101 y T201 se integraron con revisión cruzada y auditoría de Claude; T102, T202, T301, T302, T401 y T402 se integraron con la política de entrega directa vigente desde el 26 de octubre (ver `agents/reports/production-flujo-directo.md`). T403 y T404 están DONE: la aplicación está publicada en https://tbl4z3r.github.io/AstroDetect/ desde el commit `64a2699`, verificada el 27 de octubre de 2026, y el informe académico final está en [docs/informe/informe.pdf](docs/informe/informe.pdf). Queda en backlog T405, caso desconocido, como trabajo futuro.

Equipo: Bastián Echeverría, Alexander Ferias y Emiliano Toledo, Licenciatura en Ingeniería en Ciencias de la Computación, Pontificia Universidad Católica de Chile. Curso Paseo por el Universo, profesor Juan Carlos Beamin Muhlenbrock; entrega el 2 de noviembre de 2026.

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

La aplicación está publicada en GitHub Pages: entrega archivos estáticos y cada navegador hace sus propios cálculos. La evidencia de publicación está en agents/evidence/T403; las comprobaciones son acotadas y no garantizan disponibilidad universal. No hay cuentas, servidor de cálculo, API de IA ni cobros por usuario.

La ausencia de fines de lucro no define una licencia de distribución. El equipo deberá decidir la licencia antes de una release reutilizable; no se ha añadido una licencia por suposición.

## Cambio de flujo vigente

El equipo retiró la revisión cruzada y la auditoría obligatoria de Claude. Se mantienen contratos, verificaciones del autor, asignación única y cierre de producción. Las menciones a revisiones ya realizadas en estados históricos no vuelven a activarlas. La organización de ramas del 28 de octubre sustituye la regla de una rama por tarea; los archivos y reportes se conservan. Consulta agents/tasks/asignaciones-actuales.md antes de trabajar.
