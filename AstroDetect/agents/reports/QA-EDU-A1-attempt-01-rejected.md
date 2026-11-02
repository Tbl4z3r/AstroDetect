# QA educativa — A1 — Intento 01 rechazado

- Fecha, tarea y versión: 2 de noviembre de 2026, América/Santiago. Asignación directa del usuario: probar la entrega educativa, rechazar la integración si hay errores, cerrar el rol de tester, corregir en develop y volver a QA antes de integrar en main. No se inicia otra tarea del backlog.
- Estado de esta ronda: finalizada. Dictamen: NO APTA; integración a main rechazada para esta candidata.
- Autor y persona asignada: A1, rol temporal de tester.
- Base y referencia probada: `749e990841a2cd25e4ec51cff6435e07a270b286`, promovida por avance rápido desde develop a qa con autorización del usuario. Main se conserva en `25a3276901066cf8ed46064810924d1368033008` y production en `ba6d4513d58411ef3859be997b728d9416040f90` durante la ronda.
- Código de la entrega: `830f8470206f88da5837bd6b705e1b37150ac879`; su reporte y evidencia están incluidos en la candidata 749e990.
- Reporte previo: [entrega educativa](EDU-guia-y-formulas-A1-attempt-01.md).
- Contratos y dependencias: v1 conservados. Se consultaron reglas remotas, README, colaboración, ramas, contratos, asignaciones, backlog, instrucciones de calidad y reporte de entrega. Ningún código fue corregido durante esta ronda.

## Verificaciones ejecutadas

Windows, Node 22.12.0, npm 10.9.0 y Chromium de Playwright. Compilación exacta de la candidata, servida localmente en 4182; el E2E tiene su preview propio en 4173.

| Control | Resultado |
|---|---|
| npm ci | Aprobado: 197 paquetes instalados, 198 auditados, 13 s; 11 avisos moderados de desarrollo ya conocidos |
| npm run lint | Aprobado, incluido control de comentarios |
| npm run typecheck | Aprobado |
| npm test -- --run | 16 archivos, 230 pruebas aprobadas |
| npm run build | Aprobado, 46 módulos; advertencia conocida de chunk 3D de unos 512 kB |
| npx vitest run --config tests/ui/browser.config.ts | 3 archivos, 7 recorridos aprobados |
| npm run test:e2e | 13 recorridos aprobados en 17,2 s |
| Exploración de cantidades y datos | 6 de 7 recorridos aprobados; un fallo de producto |
| Exploración de guía y tamaños | 11 de 12 recorridos aprobados; un fallo de producto |
| npm audit --omit=dev --json | Aprobado, cero avisos en dependencias de ejecución |
| CI de qa para 749e990 | [AstroDetect checks: success](https://github.com/Tbl4z3r/AstroDetect/actions/runs/41458347692) |

Las verificaciones automatizadas existentes no cubrían los dos fallos descritos a continuación. Sus resultados satisfactorios no autorizan esta integración. No se registraron errores JavaScript en las matrices exploratorias.

## Defectos que rechazan la integración

### EDU-QA-01 — Igualdades con operandos y resultados de distinta precisión

Severidad media, presentación científica. Abrir Observar, introducir radio estelar `1.00000001`, radio planetario `10.123456789` y período `5.00000001`, todos válidos; abrir Entender. El paso de conversión estelar muestra `R★ = 1 × 695.700.000 = 695.700.006,96 m`. La primera entrada visible se redondeó a 1, mientras el resultado usó el valor introducido: hay una discrepancia de 6,96 m respecto de la igualdad escrita. El paso del planeta muestra análogamente `10,1235 × 6.378.100 = 64.568.419,75 m`. La configuración resumida también pierde decimales.

El motor conserva y calcula las entradas correctas. El defecto consiste en enseñar una igualdad que no se sostiene con los operandos mostrados. Se debe conservar la precisión de las entradas en las sustituciones y declarar aproximaciones donde los resultados se redondean. La corrección no requiere cambiar el modelo físico.

### EDU-QA-02 — La guía pierde de vista su objetivo al cambiar de tamaño

Severidad media, orientación y uso adaptable. Abrir Guía a 360×800 y avanzar al paso 7, la perspectiva orbital. Cambiar a 1280×900, desplazar la página 200 px y volver a 320×640. Incluso esperando 350 ms tras cada acción, el elemento explicado puede quedar fuera del viewport mientras el caption lo sigue describiendo. El resaltado colapsa a una línea de 8 px; puede quedar detrás del caption.

En escritorio se registró el objetivo entre y=-881 y y=-362, sin área visible. Al volver a estrecho, su borde superior quedó en y=681, fuera de los 640 px disponibles. Se requiere recolocar el objetivo al cambiar la geometría o desplazar el contenido, manteniendo una zona visible separada del caption, sin bucles de desplazamiento.

## Alcance aprobado y evidencia

Pasaron ruido diminuto, 32 combinaciones de extremos válidos, 5.001 vértices, cinco centros delanteros y seis posiciones traseras sin caída, profundidad con referencia independiente, última página/muestra 5001 para P=30, invalidación y recuperación, caso sin evidencia, recorridos en cuatro viewports, texto al 200 %, teclado, veinte reaperturas de guía, conservación de datos, restauración de vistas, pausa, movimiento reducido y funcionamiento sin conexión después de cargar.

La evidencia se conserva en [attempt-01](../evidence/QA-EDU-2026-11-02/attempt-01/), con resultados y capturas de ambos fallos. Los archivos históricos T401/T402 regenerados por pruebas se restauraron a su estado anterior. No se modifican registros compartidos ni reportes de entregas previas.

## Cierre y continuidad autorizada

Se cierra aquí el rol de tester de la ronda 01 con resultado rechazado. No se integra 749e990 a main. Por la instrucción actual del usuario, a continuación A1 puede corregir estos defectos en develop, agregar regresiones, publicar la candidata corregida en qa y abrir una ronda nueva con otro reporte. La aprobación sólo corresponde al commit realmente verificado después de las correcciones. Production queda fuera de esta asignación.

Limitaciones: pruebas locales en Chromium y CI; no certificación integral de accesibilidad ni disponibilidad pública. Los avisos de desarrollo existentes no se declaran resueltos y se mantienen separados de los defectos funcionales de esta ronda.
