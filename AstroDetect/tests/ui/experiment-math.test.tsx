import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { DEFAULT_SCENARIO } from '../../src/contracts';
import type { Scenario } from '../../src/contracts';
import { simulate } from '../../src/simulation';
import ScienceGuide from '../../src/components/ScienceGuide';
import ModelReference from '../../src/components/ModelReference';
import { experimentQuantities, formatExperimentNumber, formatExperimentOperand } from '../../src/components/experimentMath';

test('explica unidades y magnitudes con valores nominales y contactos calculados independientemente', () => {
  const result = simulate(DEFAULT_SCENARIO);
  const values = experimentQuantities(DEFAULT_SCENARIO, result);
  expect(values.starRadiusMetres).toBe(695700000);
  expect(values.planetRadiusMetres).toBe(63781000);
  expect(values.periodSeconds).toBe(432000);
  expect(values.orbitMetres).toBeCloseTo(8560644525.098671, 4);
  expect(values.depth).toBeCloseTo(0.008405017877225196, 14);
  expect(values.centralFlux).toBeCloseTo(0.991594982122775, 14);
  expect(values.durationDays).toBeCloseTo(2.570692273233072 - 2.429307726766928, 12);
  expect(values.cadenceSeconds).toBe(432);
  expect(values.noiseSigma).toBe(0.0005);
});

test('conserva las relaciones de área y Kepler al cambiar las entradas del experimento', () => {
  const base = { ...DEFAULT_SCENARIO, planetRadiusEarth: 5, periodDays: 2 };
  const values = experimentQuantities(base, simulate(base));
  const biggerPlanet = { ...base, planetRadiusEarth: 10 };
  const biggerStar = { ...base, starRadiusSolar: 2 };
  const slowerOrbit = { ...base, periodDays: 16 };
  expect(experimentQuantities(biggerPlanet, simulate(biggerPlanet)).depth / values.depth).toBeCloseTo(4, 10);
  expect(experimentQuantities(biggerStar, simulate(biggerStar)).depth / values.depth).toBeCloseTo(0.25, 10);
  expect(experimentQuantities(slowerOrbit, simulate(slowerOrbit)).orbitMetres / values.orbitMetres).toBeCloseTo(4, 12);
});

test('las explicaciones siguen siendo finitas en las 32 combinaciones de extremos válidos', () => {
  for (const starRadiusSolar of [0.5, 2]) for (const planetRadiusEarth of [1, 20])
    for (const periodDays of [1, 30]) for (const noisePpm of [0, 5000]) for (const seed of [0, 4294967295]) {
      const scenario: Scenario = { starRadiusSolar, planetRadiusEarth, periodDays, noisePpm, seed };
      const values = experimentQuantities(scenario, simulate(scenario));
      expect(Object.values(values).every(Number.isFinite)).toBe(true);
      expect(values.durationDays).toBeGreaterThan(0);
      expect(values.durationDays).toBeLessThan(periodDays);
      expect(values.depth).toBeGreaterThan(0);
      expect(values.centralFlux).toBeGreaterThan(0);
      expect(values.centralFlux).toBeLessThan(1);
    }
});

test('la referencia y la guía muestran el escenario actual y separan datos conocidos de inferencias', () => {
  const scenario = { ...DEFAULT_SCENARIO, periodDays: 10, planetRadiusEarth: 5, noisePpm: 0 };
  const result = simulate(scenario);
  const html = renderToStaticMarkup(<ScienceGuide scenario={scenario} result={result} detection={null} valid onExperiment={() => {}} />);
  const reference = renderToStaticMarkup(<ModelReference scenario={scenario} result={result} />);
  expect(html).toContain('Leer lo que cuenta una estrella');
  expect(html).toContain('864.000');
  expect(html).toContain('2.101,25');
  expect(html).toContain('Masa estelar: 1 M☉, fija.');
  expect(html).toContain('Esta dispersión estimada s no es la σ que configuraste.');
  expect(html).toContain('Tu última búsqueda aún no aporta un período estimado válido.');
  expect(html).toContain('no entrega ambos tamaños absolutos ni la masa del planeta');
  expect(reference).toContain('Masa estelar del modelo');
  expect(reference).toContain('Duración física del tránsito');
  expect(reference).toContain('50');
});

test('una configuración inválida retira las sustituciones numéricas del experimento anterior', () => {
  const html = renderToStaticMarkup(<ScienceGuide scenario={DEFAULT_SCENARIO} result={simulate(DEFAULT_SCENARIO)} detection={null} valid={false} onExperiment={() => {}} />);
  expect(html).toContain('Corrige la configuración en Observar');
  expect(html).not.toContain('8.405,02');
  expect(html).not.toContain('Tu escenario:');
  expect(html).not.toContain('calculation-steps');
});

test('el formato conserva la distinción entre cero y un ruido positivo muy pequeño', () => {
  expect(formatExperimentNumber(0, 8)).toBe('0');
  expect(formatExperimentNumber(1e-12, 8)).not.toBe('0');
  expect(formatExperimentNumber(1e-12, 8)).toContain('12');
});

test('las sustituciones conservan los operandos aceptados y distinguen resultados redondeados', () => {
  const scenario = { ...DEFAULT_SCENARIO, starRadiusSolar: 1.00000001, planetRadiusEarth: 10.123456789, periodDays: 5.000001 };
  const html = renderToStaticMarkup(<ScienceGuide scenario={scenario} result={simulate(scenario)} detection={null} valid onExperiment={() => {}} />);
  const text = html.replace(/<[^>]+>/g, '');
  expect(text).toContain('estrella de 1,00000001 R☉');
  expect(text).toContain('planeta de 10,123456789 R⊕');
  expect(text).toContain('período de 5,000001 días');
  expect(text).toContain('R★ = 1,00000001 × 695.700.000 ≈ 695.700.006,96 m');
  expect(text).toContain('Rₚ = 10,123456789 × 6.378.100 ≈ 64.568.419,75 m');
  expect(text).toContain('Pₛ = 5,000001 × 86.400 ≈ 432.000,0864 s');
  expect(text).toContain('μ = 1,3271244E+20 m³/s²');
  expect(text).toContain('432.000,0864² / (4π²)');
  expect(text).not.toContain('δ = (0,09281072)²');
});

test('los operandos conservan exactamente el valor numérico aceptado incluso en límites de precisión', () => {
  for (const value of [0, Number.MIN_VALUE, 1e-12, 1.0000000000000002, 1.00000001, 10.123456789, 5.000001, 29.999999999999996, 4294967295]) {
    const text = formatExperimentOperand(value);
    expect(Number(text.replaceAll('.', '').replace(',', '.'))).toBe(value);
  }
  expect(formatExperimentOperand(1.3271244e20, true)).toBe('1,3271244E+20');
});
