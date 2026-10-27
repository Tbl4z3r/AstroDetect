# T403 · preparación de publicación · intento 01

- Autor funcional: PRODUCTOR, preparación delegada a A3 por producción; no es revisión de código.
- Asignación: preparar solamente workflow y documentación de publicación, sin ejecutar despliegue.
- Fecha: 26 de octubre de 2026.
- Base local leída al iniciar: `4b48bc5f36db7b62ed01b039fc15a20fbcbfb454`.
- Estado de esta preparación: **DELIVERED**.
- Estado de la tarea completa T403: pendiente; T402 y las verificaciones de publicación todavía no están completadas por esta entrega.
- Referencia de entrega: cambios locales sin commit creado por este agente. Producción fijará el SHA al integrar.

## Archivos entregados

- `.github/workflows/deploy.yml`, en raíz Git.
- `AstroDetect/docs/publicacion.md`.
- `AstroDetect/agents/reports/T403-PRODUCTOR-attempt-01.md`.

No se cambió Vite, CI, dependencias, aplicación, contratos, registro, configuraciones de GitHub ni estructura de carpetas.

## Comportamiento preparado

El workflow usa únicamente main y permite primera publicación manual. Los pushes relevantes sólo publican si producción habilita posteriormente la variable PAGES_AUTO_DEPLOY=true; por defecto validan sin publicar. El build comprueba T402 DONE, fija el SHA del evento, usa Node 22.12.0 y ejecuta los mismos controles de instalación, lint, tipos, pruebas, build y e2e que CI antes de cargar dist. El despliegue recibe solamente el artefacto de esa ejecución satisfactoria, con permisos Pages/OIDC restringidos al job y entorno github-pages.

Se conserva `base: '/AstroDetect/'`. configure-pages se prepara con enablement:false y no presupone poder habilitar Pages con el token integrado. La documentación indica el paso exacto de la persona administradora en Settings → Pages → Source → GitHub Actions y distingue URL prevista de publicación real.

## Verificaciones realmente realizadas

Se leyeron AGENTS, colaboración, contratos, rol de producción, T403, backlog, workflow CI, package.json, configuración Playwright y base de Vite. Se consultaron las definiciones oficiales de las cinco acciones en sus referencias de versión y la guía de workflows de Pages; configure-pages documenta expresamente el requisito adicional para habilitar Pages.

Se analizó el YAML con Node y `js-yaml` ya presente en node_modules, sin añadir dependencias. La comprobación local terminó con exit 0: eventos manual/push y filtro main correctos; ausencia de evento pull_request; dependencia deploy→build; ruta de trabajo, ruta de artefacto, entorno y permisos esperados. Se extrajo y ejecutó únicamente el guard de T402: terminó con exit 1 y el mensaje esperado `T402 must be DONE before publication`, confirmando que el estado pendiente impide continuar. También se comprobaron los tres archivos sin espacios finales.

El comando se ejecutó mediante un script Node suministrado por entrada estándar, sin crear scripts adicionales. Un intento inicial de usar Python no pudo iniciarse en este entorno; se reemplazó por el parser existente de Node. Una consulta Git de verificación de espacios desde un contexto que no expuso el worktree no fue utilizable; la comprobación de espacios se hizo directamente sobre los archivos. No se declaró ninguno de esos intentos como aprobado.

No se ejecutó GitHub Actions, no se instalaron dependencias, no se ejecutaron suites de aplicación y no se inició despliegue. Los controles completos y la ejecución remota quedan pendientes para cerrar la publicación.

## Pendientes y límites

1. Producción debe completar T402, publicar su estado DONE y fijar el commit de esta entrega.
2. Confirmar que una persona con administración haya habilitado Pages mediante GitHub Actions; si falta, T403 permanece bloqueada por acceso/configuración.
3. Ejecutar manualmente el workflow en main y verificar sus resultados reales.
4. Registrar SHA, run, URL efectiva y comprobaciones HTTPS, recursos de subruta, móvil, recarga y diez contextos independientes.
5. Decidir después de la primera publicación si mantener publicación manual o habilitar la variable opcional de automatización.

No se afirma que exista un sitio publicado. La referencia `https://tbl4z3r.github.io/AstroDetect/` es prevista. No se marcaron pruebas no ejecutadas como aprobadas ni se cambió el registro a DONE.

## Reversión y continuidad

Antes de integrar, los tres archivos nuevos pueden retirarse sin cambiar la aplicación. Después, usar commits de reversión y una nueva publicación validada según docs/publicacion.md, conservando historial. Siguiente responsable: producción para aceptación T402, permisos y ejecución de publicación. El agente se detiene tras esta preparación; no asume tareas nuevas.
