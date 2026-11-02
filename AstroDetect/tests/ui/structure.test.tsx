import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../../src/app/App';

test('presenta estructura educativa, selector estelar y seis controles etiquetados sin resultados ficticios', () => {
  const html = renderToStaticMarkup(<App />);
  expect(html.match(/type="number"/g)).toHaveLength(6);
  expect(html.match(/<label /g)).toHaveLength(8);
  expect(html).toContain('Modelo de estrella');
  expect(html).toContain('Vistas del cuaderno');
  expect(html).toContain('id="view-laboratory"');
  expect(html).toContain('id="view-guide" hidden=""');
  expect(html).toContain('id="view-experiments" hidden=""');
  expect(html).toContain('Referencia del modelo');
  expect(html).toContain('Guía');
  expect(html).toContain('Del movimiento a la evidencia');
  expect(html).not.toContain('Cuaderno orbital');
  expect(html).not.toContain('Mismo sistema · mismo tiempo');
  expect(html).toContain('Masa estelar del modelo');
  expect(html).toContain('1 M☉');
  expect(html).toContain('Inclinación de 90°');
  expect(html).toContain('No hay resultados de detección');
  expect(html).toContain('Buscar posibles tránsitos');
  expect(html).not.toContain('data-testid="detection-results"');
});
