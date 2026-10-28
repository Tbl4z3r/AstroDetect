import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../../src/app/App';

test('presenta estructura educativa y cinco controles etiquetados sin resultados ficticios', () => {
  const html = renderToStaticMarkup(<App />);
  expect(html.match(/type="number"/g)).toHaveLength(5);
  expect(html.match(/<label /g)).toHaveLength(6);
  expect(html).toContain('Vistas del cuaderno');
  expect(html).toContain('id="view-laboratory"');
  expect(html).toContain('id="view-guide" hidden=""');
  expect(html).toContain('id="view-experiments" hidden=""');
  expect(html).toContain('Referencia del modelo');
  expect(html).toContain('Simulación educativa');
  expect(html).toContain('masa estelar fija de una masa solar');
  expect(html).toContain('inclinación fija de 90°');
  expect(html).toContain('No hay resultados de detección');
  expect(html).toContain('Buscar posibles tránsitos');
  expect(html).not.toContain('data-testid="detection-results"');
});
