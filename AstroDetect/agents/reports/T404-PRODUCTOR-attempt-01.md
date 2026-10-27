# T404 · informe académico · intento 01

- Autor: PRODUCTOR, ejercido por Claude Code a petición de la usuaria del proyecto.
- Fecha: 27 de octubre de 2026.
- Base: `main` `724a68715faf0bcd90b86e9ae61ed8969f1ee437`.
- Rama: `task/T404`.
- Estado propuesto: **BLOCKED** para la versión final (criterio 1); borrador completo **DELIVERED**.

## Archivos entregados

- `docs/informe/informe.html`: fuente del informe.
- `docs/informe/informe.pdf`: exportación PDF, 10 páginas tamaño carta, Times New Roman 12, interlineado 1,5, márgenes de 2,5 cm y numeración de página.
- `agents/evidence/T404/`: capturas reales del prototipo (`configuracion.png`, `observacion-transito.png`, `curva.png`, `deteccion.png`), resultados del análisis del detector (`detector-grid.json`) y el script que los generó (`detector-grid.mjs.txt`).
- En la misma rama, como producción: README y CHANGELOG actualizados al estado real, y registro con T403 y T404 en BLOCKED con su motivo.

## Criterios

| Criterio | Estado | Evidencia |
| --- | --- | --- |
| 1. Carreras, curso, portada y fecha confirmados | **Bloqueado** | No están informados en el repositorio ni por la usuaria. La portada y la introducción los marcan como pendientes en amarillo; no se inventaron. |
| 2. Formato y 8–12 páginas, PDF legible | Cumple | 10 páginas contando portada y referencias. Fuente verificada como disponible al exportar; las tres figuras cargan. Se recortó la captura del detector para que el texto sea legible. |
| 3. Ciencia, herramientas, diseño, capturas reales, discusión, conclusiones y bibliografía | Cumple, salvo el aporte de cada carrera | Secciones 2 a 8 y 12 referencias, 10 de ellas artículos académicos. El párrafo sobre el aporte de las carreras queda pendiente por el criterio 1. |
| 4. Distinguir resultados ejecutados de objetivos futuros; demo no publicada declarada | Cumple | La sección 8 declara que el sitio no está publicado y que la URL prevista no está activa. La evaluación educativa se presenta como diseño no aplicado. |

## Verificaciones realmente ejecutadas

En `main` `724a687`, Windows 11, Node 22.12.0, npm 10.9.0, Chromium de Playwright 1.64.1:

- `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`: aprobados.
- `npm test -- --run`: 14 archivos, 222 pruebas aprobadas.
- `npm run test:e2e`: 4 pruebas aprobadas. Esta ejecución reescribe `agents/evidence/T402/ten-contexts.json` con mediciones nuevas; se restauró el archivo original para no alterar la evidencia de T402.
- `npx vitest run --config tests/ui/browser.config.ts`: 3 archivos, 7 recorridos aprobados.
- Análisis del detector: `src/simulation` y `src/analysis` compilados con `tsc` fuera del repositorio; 16 combinaciones de radio planetario (2, 5, 10, 20 R⊕) y ruido (100, 500, 1000, 5000 ppm), 20 semillas cada una, estrella de 1 R☉ y P = 5 días. Resultados en `detector-grid.json` y en la Tabla 1 del informe.
- Capturas: build de `main` servido con `vite preview` y fotografiado con Playwright a 1100 px de ancho, con el tiempo situado en 2,5 días.

Las cifras de rendimiento y de diez sesiones citadas en el informe provienen de la evidencia de T402 (`agents/evidence/T402/performance.json` y `ten-contexts.json`), no de una medición nueva.

## Pendientes

1. La usuaria o el equipo deben informar carreras de cada integrante, curso, sección, docente, institución y fecha de entrega. Con eso se completan la portada, el párrafo de aportes por carrera y se vuelve a exportar el PDF.
2. Cuando T403 publique el sitio, actualizar el párrafo de estado de publicación de la sección 8 con la URL efectiva.
3. Revisión humana del PDF completo por parte del equipo antes de entregarlo al curso.

## Continuidad

T404 queda BLOCKED en el registro hasta recibir los datos del punto 1. No se reorganizó el repositorio ni se cambió código de la aplicación.
