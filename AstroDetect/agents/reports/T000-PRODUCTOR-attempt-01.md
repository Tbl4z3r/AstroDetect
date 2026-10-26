# Reporte T000 — PRODUCTOR — Intento 01

- Fecha y versión objetivo: 26 de octubre de 2026; 0.1.0-alpha.
- Estado sugerido: REVIEW.
- Tarea y rol: T000, base reproducible y contratos; producción por asignación explícita del usuario, que sustituye la asignación anterior A2/T201. No se implementó T201.
- Base de trabajo y rama: `085da46f71f841dcacdc5ac6756425c1c0288781`, `origin/main` actualizado mediante fetch; rama local `task/T000`.
- Referencia entregada de código: `b4b8803a361e6f16d56c98074e6267fd517d3528`.
- Reporte previo: ninguno para T000.
- Dependencias: ninguna. Contrato v1/1.0.0, consumiendo el modelo científico y los acuerdos existentes.

## Alcance realizado

Antes sólo existía documentación. Ahora existe una aplicación React mínima que arranca desde `/AstroDetect/`, sin controles, gráficos, simulación ni detector. Se congelaron tipos, firmas, límites, valores iniciales, constantes y convenciones de ruido en `src/contracts/index.ts` y `docs/contratos.md`. Sólo se implementó la validación de opciones del detector; la validación científica queda con A1.

Archivos de aplicación y herramientas: `package.json`, `package-lock.json`, `index.html`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.js`, `src/main.tsx`, `src/app/App.tsx`, `src/contracts/index.ts`, `scripts/check-source-comments.mjs`, `tests/smoke/contracts.test.ts`, `tests/smoke/comments.test.ts`, `tests/e2e/smoke.spec.ts`. Documentación: `docs/contratos.md` y este reporte. Producción registra T000 IN_PROGRESS en `agents/tasks/backlog.json`.

El workflow está en `.github/workflows/ci.yml` en la raíz Git real, un nivel sobre la carpeta de aplicación. Es necesario para que GitHub lo descubra; ejecuta los comandos dentro de `AstroDetect`. Permisos `contents: read`; no publica ni despliega.

## Verificación real

Entorno: Windows, PowerShell, Node 22.12.0, npm 10.9.0; Chromium Headless Shell 156 de Playwright 1.64.1.

Secuencia ejecutada dentro de la carpeta de aplicación:

- `npm ci`: aprobado; 189 paquetes añadidos, 190 auditados, cero vulnerabilidades informadas.
- `npm run lint`: aprobado, incluyendo control de comentarios con AST TypeScript, parse5 para HTML y PostCSS para CSS. Se prueban también literales URL, expresiones regulares y comentarios JSX.
- `npm run typecheck`: aprobado en modo estricto.
- `npm test -- --run`: aprobado; 2 archivos, 28 pruebas. Opciones válidas, inválidas, no finitas, enteros, límites abiertos, mensajes por campo e inmutabilidad de entrada; control de comentarios por lenguaje.
- `npm run build`: aprobado; salida estática en `dist/`.
- `npm run test:e2e`: aprobado; 1 prueba en Chromium abre la subruta compilada, verifica contenido, recarga y ausencia de errores de página, peticiones fallidas y respuestas HTTP de error.
- `npm ls --depth=0`: aprobado; versiones directas fijadas sin rangos.
- `git diff --check`: aprobado; Git informa únicamente normalización futura LF/CRLF.

Incidencias resueltas durante preparación: el primer intento de fijar typescript-eslint 8.48.1 chocó con TypeScript 6; se fijó TypeScript 5.9.3 compatible, sin forzar dependencias. La prueba inicial del control de comentarios encontró un fallo real en JSX; se corrigió el recorrido del AST y pasó la regresión. El primer e2e falló porque Chromium todavía se descargaba; se repitió tras completar la instalación y pasó. No se cuentan estos intentos como aprobados.

Pendientes: ejecutar CI en GitHub; otras plataformas y navegadores no comprobados. No se verifican todavía funciones científicas, controles ni aceptación del MVP, porque no existen en T000.

## Decisiones y límites

Se fijan Node 22.12.0 en CI y npm 10.9.0 como gestor; el rango de ejecución declarado admite Node 22 desde 22.12.0 y npm 10 desde 10.9.0. Las dependencias están bloqueadas en el lockfile. La instalación emite una advertencia de soporte de ESLint 9.39.5; lint pasa y npm informa cero vulnerabilidades. Se conserva por compatibilidad con el entorno comprobado; esto no equivale a afirmar soporte futuro.

Se consultaron las guías oficiales de [Vite](https://vite.dev/guide/) y [Vitest](https://main.vitest.dev/guide/) para requisitos de runtime. La instalación limpia y las pruebas validan las versiones concretas del lockfile.

La implementación de PRNG, geometría, muestreo y detector sigue pendiente de sus tareas. No se introdujeron mocks, comentarios de código, servicios externos de cálculo, cuentas ni dependencias gráficas. La pantalla sólo informa que el laboratorio está pendiente.

## Continuidad y reversión

A3 debe revisar una referencia concreta, reproducir los controles pertinentes y entregar `agents/reviews/T000-reviewer-A3-attempt-01.md`, sin corregir código. Producción corregirá hallazgos necesarios y solicitará nueva revisión. Sólo podrá cerrar T000 tras revisión del código final y controles requeridos; las tareas dependientes siguen sin asignación.

Reversión: revertir los commits de T000 mediante nuevos commits, sin borrar historia ni cambios ajenos. No hay despliegue ni migración de datos. Si no se logra escribir en GitHub, conservar los commits locales y distinguir aceptación local de integración remota.
