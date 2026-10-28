import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Orbit3D from '../../src/components/Orbit3D';
import { DEFAULT_SCENARIO } from '../../src/contracts';

test('el esquema declara la ampliación de un planeta pequeño en vez de atribuirle una escala física', () => {
  const html = renderToStaticMarkup(<Orbit3D scenario={{ ...DEFAULT_SCENARIO, starRadiusSolar: 2, planetRadiusEarth: 1 }} timeDays={0} reducedMotion />);
  expect(html).toContain('Planeta ampliado ×8,7');
  expect(html).toContain('distancia orbital comprimida');
  expect(html).not.toContain('Proporción real entre los radios.');
});

test('los tamaños suficientemente grandes mantienen la razón real en la representación', () => {
  const html = renderToStaticMarkup(<Orbit3D scenario={DEFAULT_SCENARIO} timeDays={2.5} reducedMotion={false} />);
  expect(html).toContain('Proporción real entre los radios.');
  expect(html).not.toContain('Planeta ampliado');
  expect(html).toContain('Girar a la izquierda');
  expect(html).toContain('Centrar cámara');
});
