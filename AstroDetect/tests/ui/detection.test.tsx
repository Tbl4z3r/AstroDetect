import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { analyzeMeasurements } from '../../src/app/analyzeMeasurements';
import DetectionPanel from '../../src/components/DetectionPanel';
import type { DetectionResult } from '../../src/contracts';

test('el análisis usa mediciones aunque la curva ideal contenga disminuciones diferentes', () => {
  const samples = Array.from({ length: 100 }, (_, index) => ({
    timeDays: index,
    cleanFlux: index >= 10 && index <= 12 ? 0.5 : 1,
    observedFlux: 1,
  }));
  const original = structuredClone(samples);
  expect(analyzeMeasurements(samples).status).toBe('no-evidence');
  expect(samples).toEqual(original);
});

test('mediciones con tres caídas periódicas producen candidatos sin consultar flujo limpio', () => {
  const samples = Array.from({ length: 100 }, (_, index) => ({
    timeDays: index,
    cleanFlux: 1,
    observedFlux: [10, 11, 12, 30, 31, 32, 50, 51, 52].includes(index) ? 0.98 : 1,
  }));
  const result = analyzeMeasurements(samples);
  expect(result.status).toBe('candidate');
  expect(result.events.map(event => event.centerDays)).toEqual([11, 31, 51]);
  expect(result.estimatedPeriodDays).toBe(20);
  expect(result.warnings).toContain('Una señal candidata no confirma un planeta.');
});

test('el panel explica datos insuficientes y período ausente sin inventar eventos', () => {
  const result: DetectionResult = {
    status: 'insufficient-data', events: [], estimatedPeriodDays: null,
    warnings: ['No hay suficientes muestras para analizar la serie.'],
  };
  const html = renderToStaticMarkup(<DetectionPanel result={result} error={null} disabled={false} onDetect={() => {}} />);
  expect(html).toContain('Datos insuficientes para el análisis');
  expect(html).toContain('No se pudo estimar un período');
  expect(html).not.toContain('Eventos candidatos');
  expect(html).not.toContain('insufficient-data');
  expect(html).toContain('No hay suficientes muestras');
});

test('el panel muestra errores explícitos y mantiene el análisis deshabilitado si la configuración es inválida', () => {
  const html = renderToStaticMarkup(<DetectionPanel result={null} error="Los tiempos deben ser estrictamente crecientes." disabled onDetect={() => {}} />);
  expect(html).toContain('role="alert"');
  expect(html).toContain('Los tiempos deben ser estrictamente crecientes.');
  expect(html).toContain('disabled=""');
  expect(html).not.toContain('data-testid="detection-results"');
});
