import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import TransitAnimation from '../../src/components/TransitAnimation';
import LightCurve from '../../src/components/LightCurve';
import { DEFAULT_SCENARIO } from '../../src/contracts';

test('la vista del observador usa posición del motor y oculta el planeta posterior', () => {
  const front = renderToStaticMarkup(<TransitAnimation scenario={DEFAULT_SCENARIO} timeDays={2.5} />);
  const back = renderToStaticMarkup(<TransitAnimation scenario={DEFAULT_SCENARIO} timeDays={5} />);
  expect(front).toContain('data-front="true"');
  expect(front).toContain('cx="240"');
  expect(front.indexOf('data-testid="star"')).toBeLessThan(front.indexOf('data-testid="planet"'));
  expect(back).toContain('data-front="false"');
  expect(back.indexOf('data-testid="planet"')).toBeLessThan(back.indexOf('data-testid="star"'));
});

test('la curva conserva todas las muestras y valores observados superiores a uno', () => {
  const result = { durationDays: 2, cadenceDays: 1, samples: [
    { timeDays: 0, cleanFlux: 1, observedFlux: 1.1 },
    { timeDays: 1, cleanFlux: 0.99, observedFlux: 0.98 },
    { timeDays: 2, cleanFlux: 1, observedFlux: 1.02 },
  ] };
  const html = renderToStaticMarkup(<LightCurve result={result} timeDays={1} />);
  expect(html).toContain('1.109600');
  expect(html).toContain('0.970400');
  expect(html).toContain('3 muestras completas');
  expect(html).toContain('data-time-days="1"');
  expect(html).toContain('x1="348"');
  expect(html.match(/M74\.000,.*?L348\.000,.*?L622\.000,/g)).toHaveLength(2);
});
