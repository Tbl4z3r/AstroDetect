# T407 · vista orbital en 3D · intento 01

- Autor: PRODUCTOR, ejercido por Claude Code a petición de la usuaria del proyecto.
- Fecha: 27 de octubre de 2026.
- Base: `main` `fb0c476` (T406 integrada y publicada; se registra T406 DONE en este cambio). Rama: `task/T407`.
- Estado propuesto: DELIVERED.

## Cambios

- Dependencia nueva `three` 0.169.0 (versión fija) y `@types/three` 0.169.0 de desarrollo. `npm install` informó 0 vulnerabilidades.
- `src/components/orbitScene.ts`: escena Three.js con estrella (esfera con textura procedural de granulación y halo aditivo), planeta (esfera con bandas procedurales e iluminación desde la estrella), órbita, fondo de estrellas y cámara orientable con `OrbitControls` (arrastrar, acercar; doble clic restablece). Texturas generadas en canvas; ningún recurso externo.
- `src/components/Orbit3D.tsx`: carga la escena con `import()` diferido (chunk aparte de 512 kB, 127 kB comprimido, que no retrasa la primera pintura) y la actualiza con el tiempo compartido. El ángulo orbital sale de `positionAt` y del semieje de `semiMajorAxisMetres`; no duplica la física. Radio del planeta con la proporción real r/R (mínimo visual 0,04) y órbita comprimida a 4 radios estelares, declarado en el pie. Con movimiento reducido no rota la estrella. Sin WebGL muestra un aviso y la vista 2D y la curva siguen funcionando.
- `App.tsx` monta la vista bajo la del observador; `laboratory.css` añade su estilo. La vista 2D, la simulación, el detector y los contratos no cambian.

## Verificaciones

Windows 11, Node 22.12.0, Chromium de Playwright 1.64.1:

- `npm run lint`, `npm run typecheck`, `npm run build`: aprobados (Vite advierte que el chunk 3D supera 500 kB; se carga de forma diferida).
- `npm test -- --run`: 222 pruebas aprobadas. `npm run test:e2e`: 4 aprobadas. `npx vitest run --config tests/ui/browser.config.ts`: 7 aprobadas.
- Vista previa con WebGL por SwiftShader: la escena se dibuja, sin errores de consola; sin desplazamiento horizontal a 390 px.
- Chromium con WebGL desactivado: aparece el aviso, la curva sigue disponible y no hay errores.
- Las pruebas e2e y de navegador reescriben evidencias de T401 y T402; se restauraron.

Capturas en `agents/evidence/T407/`.

## Continuidad

Producción integra, registra DONE y vuelve a ejecutar «Publish AstroDetect Pages». Extensiones posibles: inclinación configurable, oscurecimiento de limbo en la textura de la estrella, más planetas o un modo de caso desconocido (T405) con la verdad oculta.
