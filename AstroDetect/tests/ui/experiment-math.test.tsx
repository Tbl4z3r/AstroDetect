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
  expect(values.starMassSolar).toBe(1);
  expect(values.gravitationalParameter).toBe(1.3271244e20);
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

test('las explicaciones siguen siendo finitas en las 64 combinaciones de extremos válidos', () => {
  for (const starRadiusSolar of [0.2, 2]) for (const starMassSolar of [0.2, 1.6]) for (const planetRadiusEarth of [1, 20])
    for (const periodDays of [1, 30]) for (const noisePpm of [0, 5000]) for (const seed of [0, 4294967295]) {
      const scenario: Scenario = { starRadiusSolar, starMassSolar, planetRadiusEarth, periodDays, noisePpm, seed };
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
  expect(html).toContain('Masa estelar: 1 M☉.');
  expect(html).toContain('Similar al Sol, modelo educativo de tipo G.');
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
  expect(text).toContain('μ☉ = 1,3271244E+20 m³/s²');
  expect(text).toContain('μ = 1,3271244E+20 × 1 ≈ 1,3271244E+20 m³/s²');
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

test('las cantidades incorporan masa estelar con referencias independientes y conservan el escenario legado', () => {
  const base = { ...DEFAULT_SCENARIO, noisePpm: 0 };
  const lowMass = { ...base, starMassSolar: 0.2 };
  const highMass = { ...base, starMassSolar: 1.6 };
  const low = experimentQuantities(lowMass, simulate(lowMass));
  const high = experimentQuantities(highMass, simulate(highMass));
  expect(low.orbitMetres).toBeCloseTo(5006295288.384681, 4);
  expect(high.orbitMetres).toBeCloseTo(10012590576.769361, 4);
  expect(high.orbitMetres / low.orbitMetres).toBeCloseTo(2, 13);
  expect(low.gravitationalParameter).toBe(2.6542488e19);
  expect(high.gravitationalParameter).toBe(2.12339904e20);
  expect(low.durationDays).toBeCloseTo(0.24238216709325092, 13);
  expect(high.durationDays).toBeCloseTo(0.1208392244708325, 13);
  expect(low.depth).toBeCloseTo(0.008405017877225196, 14);
  expect(high.depth).toBe(low.depth);
  const legacy: Scenario = { starRadiusSolar: 1, planetRadiusEarth: 10, periodDays: 5, noisePpm: 0, seed: 42 };
  expect(experimentQuantities(legacy, simulate(legacy))).toEqual(experimentQuantities(base, simulate(base)));
});

test('las explicaciones muestran la masa elegida y distinguen una estrella tipo de una combinación libre', () => {
  const scenario = { ...DEFAULT_SCENARIO, starMassSolar: 0.3, starRadiusSolar: 0.3 };
  const result = simulate(scenario);
  const guide = renderToStaticMarkup(<ScienceGuide scenario={scenario} result={result} detection={null} valid onExperiment={() => {}} />).replace(/<[^>]+>/g, '');
  const reference = renderToStaticMarkup(<ModelReference scenario={scenario} result={result} />).replace(/<[^>]+>/g, '');
  expect(guide).toContain('Masa estelar: 0,3 M☉.');
  expect(guide).toContain('Enana roja, modelo educativo de tipo M.');
  expect(guide).toContain('M★ = 0,3 M☉');
  expect(guide).toContain('μ = 1,3271244E+20 × 0,3 ≈ 3,9813732E+19 m³/s²');
  expect(guide).not.toContain('masa estelar fija');
  expect(guide).toContain('cambiar únicamente el color no cambia el flujo normalizado');
  expect(guide).toContain('Una estrella de neutrones');
  expect(guide).toContain('mín[1, (Rₚ/R★)²]');
  expect(reference).toContain('Enana roja');
  expect(reference).toContain('0,3 M☉');
  const free = { ...scenario, starRadiusSolar: 0.4 };
  const freeReference = renderToStaticMarkup(<ModelReference scenario={free} result={simulate(free)} />);
  expect(freeReference).toContain('Configuración libre');
  expect(freeReference).toContain('no valida una estrella real');
  expect(freeReference).not.toContain('Enana roja');
});

test('un tránsito insuficientemente muestreado advierte su límite sin atribuir ausencia al planeta', () => {
  const scenario = { ...DEFAULT_SCENARIO, starMassSolar: 1.6, starRadiusSolar: 0.2, periodDays: 30, planetRadiusEarth: 1 };
  const result = simulate(scenario);
  const values = experimentQuantities(scenario, result);
  expect(values.durationDays).toBeCloseTo(0.042031592197148554, 13);
  expect(result.cadenceDays).toBe(0.03);
  const guide = renderToStaticMarkup(<ScienceGuide scenario={scenario} result={result} detection={null} valid onExperiment={() => {}} />).replace(/<[^>]+>/g, '');
  const reference = renderToStaticMarkup(<ModelReference scenario={scenario} result={result} />).replace(/<[^>]+>/g, '');
  expect(guide).toContain('Resolución temporal limitada');
  expect(guide).toContain('menor que 3 Δt');
  expect(reference).toContain('Resolución temporal limitada');
  expect(reference).toContain('una no detección no demuestra ausencia del planeta');
  const solar = renderToStaticMarkup(<ModelReference scenario={DEFAULT_SCENARIO} result={simulate(DEFAULT_SCENARIO)} />);
  expect(solar).not.toContain('Resolución temporal limitada');
});
