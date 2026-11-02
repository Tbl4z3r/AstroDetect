# QA del cuaderno orbital — A1 — Intento 01

- Fecha, tarea y versión: 2 de noviembre de 2026, América/Santiago. Encargo directo del usuario: asumir temporalmente QA, intentar romper la candidata, terminar la ronda antes de corregir, corregir los fallos y promover a main. Sin ID nuevo en backlog; no se toma T405.
- Estado sugerido: DELIVERED. Dictamen de QA: candidata apta para integrar en main, con los dos defectos funcionales corregidos y las limitaciones de esta comprobación registradas.
- Autor y persona asignada: A1 en el rol temporal de tester; posteriormente autor de las correcciones y responsable de la promoción expresamente autorizada.
- Base y rama: candidata inicial remota qa `bf96ad5e8d2f9110c4e9279004737afb986acfd3`, igual a develop. Main y production partían de `ba6d4513d58411ef3859be997b728d9416040f90`.
- Referencia del código corregido y probado en QA: [`72f5b5ffc39fb96b6aa346b8a36f74bbaa497a6f`](https://github.com/Tbl4z3r/AstroDetect/commit/72f5b5ffc39fb96b6aa346b8a36f74bbaa497a6f). Los commits posteriores de esta entrega contienen exclusivamente reporte y evidencia.
- Reporte previo: [integración del prototipo](UX-cuaderno-orbital-A1-attempt-01.md).
- Contratos y dependencias: contratos v1, simulación, detector, dependencias fijadas, configuración y registro compartido conservados. Se consultaron AGENTS, README, colaboración, ramas, contratos, modelo científico, instrucciones de calidad, asignaciones, backlog y plantilla de reporte. La asignación expresa del usuario autoriza este trabajo y la promoción hasta main.

## Alcance realizado

Se completó una ronda funcional sobre la candidata original antes de cambiar el producto. Incluyó entradas vacías, negativas, límites inclusivos, valores fuera de rango, exponentes, semillas cero y máxima, reproducibilidad, cambios rápidos de configuración y vista, resultados obsoletos, 32 combinaciones de extremos válidos, 40 regeneraciones, teclado, móvil, texto al 200 %, recorrido completo de 30 segundos, falta de conexión después de cargar y ausencia o pérdida de WebGL. Las pruebas y los motores existentes complementan las expectativas independientes de las pruebas exploratorias.

Se reprodujeron dos defectos:

1. Introducir ruido 25 mostraba 50 en su deslizador; introducir 1.234 en radio estelar, planetario o período mostraba 1.23, aunque el campo era válido. El cálculo usaba la entrada numérica, de modo que ambos controles representaban valores distintos. Se permite un paso continuo en los deslizadores para conservar los valores contractualmente válidos, sin redondear el dato introducido. Se comprobó la sincronización también con flechas, Home y End.
2. La pérdida temporal del contexto WebGL dejaba el 3D vacío sin aviso y mantenía los controles de cámara habilitados. La medición y el detector seguían funcionando. Ahora se comunica la interrupción mediante un estado accesible, se deshabilita la cámara y se pausa su renderizado; al restaurar el contexto, se recuperan la vista y los controles. El reloj y las curvas se conservan. La recuperación depende de que el navegador pueda restaurar el contexto; no se promete recuperación indefinida de una GPU indisponible.

Las dos pruebas de regresión nuevas fallaron sobre la compilación original por esos motivos concretos, y pasaron tras las correcciones. Archivos de producto modificados: `src/components/ScenarioControls.tsx` y `src/components/Orbit3D.tsx`. Pruebas añadidas: `tests/e2e/resilience.spec.ts`. Documentación y evidencia propias: este reporte y [QA-cuaderno-2026-11-02](../evidence/QA-cuaderno-2026-11-02/).

Los archivos históricos T401/T402 que los recorridos existentes regeneran se copiaron a la evidencia propia cuando correspondía y se restauraron a su contenido anterior. No se incluyen cambios a reportes ajenos, motores, contratos, dependencias, workflows, versiones ni backlog.

## Verificaciones propias

Entorno local: Windows, Node 22.12.0, npm 10.9.0 y Chromium de Playwright 1.64.1. Vista previa compilada en `http://127.0.0.1:4182/AstroDetect/`. Los recorridos automatizados de aceptación usan su propio servidor de preview en 4173. QA y develop se comprobaron sobre el mismo SHA exacto `72f5b5f`; no se integraron commits posteriores ajenos.

| Verificación sobre la candidata corregida | Resultado real |
|---|---|
| npm ci | 197 paquetes instalados y 198 auditados; instalación completada |
| npm run lint | Aprobado, incluida la prohibición de comentarios de código |
| npm run typecheck | Aprobado |
| npm test -- --run | 15 archivos, 224 pruebas aprobadas |
| npm run build | Aprobado, 43 módulos; advertencia conocida del chunk diferido de Three.js de aproximadamente 512 kB |
| npx vitest run --config tests/ui/browser.config.ts | 3 archivos, 7 recorridos aprobados |
| npm run test:e2e | 8 recorridos aprobados en 9,9 s, incluidas ambas regresiones y diez contextos simultáneos |
| Matriz exploratoria | 38 recorridos aprobados; incluyen 32 combinaciones de extremos y 40 regeneraciones; cero errores JavaScript |
| Ciencia mediante el producto | 4 comprobaciones independientes aprobadas |
| Campos numéricos y deslizadores | 4 comprobaciones aprobadas, incluyendo teclado y límites |
| Resistencia y recuperación | 7 comprobaciones aprobadas; recorrido continuo completo repetido en 31,3 s; interrupción y restauración WebGL verificadas también visualmente |
| Cambio de vista y ancho de la curva | Se recupera el ancho de escritorio, móvil y escritorio nuevamente: 952, 328 y 936 px en los contenedores probados |
| CI del commit corregido en qa | [AstroDetect checks: success](https://github.com/Tbl4z3r/AstroDetect/actions/runs/41391998445) |
| git diff --check | Aprobado antes del commit del código |

La comprobación científica no obtuvo sus expectativas de las funciones comprobadas: sobre las 5.001 coordenadas de la curva se verificaron cinco centros delanteros y seis posiciones traseras sin caída, la razón de radios en el SVG, y profundidad central `1 − (10 × 6378100 / 695700000)²`. El mínimo esperado fue 0,9915949821 y el reconstruido del SVG 0,9915953699, dentro de 0,000001 por redondeo de las etiquetas. Duplicar el radio de 5 a 10 radios terrestres cambió la caída visible de 2.101,25 a 8.405,02 ppm, aproximadamente cuatro veces. El tiempo 2,5 días mostró al planeta delante y concéntrico; el tiempo cero lo mostró detrás.

Incidencias del entorno y de los arneses, sin ocultar resultados:

- El primer arranque con argumentos a través del envoltorio de npm no inició el preview previsto; se ejecutó directamente la CLI local de Vite y se comprobó la URL correcta.
- Una segunda instalación encontró EPERM al reemplazar el módulo nativo de Rolldown, que el preview abierto mantenía en uso. Se cerró únicamente ese servidor y la instalación y todos los controles posteriores pasaron.
- Una expectativa exploratoria inicial exigía período exactamente 6, pero el detector midió 6,0015 días. Se usó la tolerancia independiente de dos cadencias, sin modificar el detector ni sus salidas.
- Una repetición de resistencia capturó la curva antes del primer reajuste de tamaño y usó un selector ambiguo para varios estados accesibles. Se corrigió el arnés para esperar la carga y seleccionar el mensaje concreto; se conservan los resultados iniciales y se registra la repetición final.

## Límites y continuidad

`npm audit` informó 11 avisos moderados en la cadena de herramientas de desarrollo relacionados con [minimatch](https://github.com/advisories/GHSA-g3hv-75wg-m249). `npm audit --omit=dev --json` terminó con cero avisos en las dependencias de ejecución. No se aplicó `npm audit fix` ni se cambiaron versiones o configuración compartida. Se entrega este mantenimiento pendiente para la decisión previa a producción; no es un fallo funcional del prototipo ni una declaración de ausencia universal de riesgos.

Las comprobaciones se limitaron a Chromium local y CI de GitHub. No se probaron físicamente Safari, Firefox, lectores de pantalla, móviles reales, disponibilidad pública ni capacidad del sitio publicado. El texto al 200 % y las pruebas de teclado no constituyen certificación completa de accesibilidad. No se realizó un despliegue.

El usuario solicitó una evaluación posterior por Claude para decidir sobre production. Esta entrega prepara main tras QA y conserva production en su versión anterior. No se envían mensajes a Claude ni se inicia otra tarea. La promoción conserva ascendencia mediante avance rápido, sin squash, rebase ni force push. Ante una regresión, corresponde un commit nuevo en develop y repetir el recorrido por QA; no se reescribe el historial.
