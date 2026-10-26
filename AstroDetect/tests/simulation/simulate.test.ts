import { describe, expect, it } from 'vitest';
import { DEFAULT_SCENARIO } from '../../src/contracts';
import type { Scenario, SimulationEngine } from '../../src/contracts';
import * as simulation from '../../src/simulation';

const { simulate, fluxAt, positionAt, validateScenario } = simulation;
const scenario = { ...DEFAULT_SCENARIO };
const centreFlux = 0.991594982122775;

describe('serie temporal limpia y observada', () => {
  it('completa la API congelada del motor sin publicar generadores internos', () => {
    const engine: SimulationEngine = { simulate, fluxAt, positionAt, validateScenario };
    expect(Object.keys(simulation).sort()).toEqual(['fluxAt', 'positionAt', 'simulate', 'validateScenario']);
    expect(engine.validateScenario(scenario)).toEqual({ valid: true, errors: [] });
    expect(engine.positionAt(scenario, 0).inFront).toBe(false);
    expect(engine.fluxAt(scenario, 0)).toBe(1);
    expect(engine.simulate(scenario).samples).toHaveLength(5001);
  });

  it.each([1, 5, 13.7, 30])('genera tiempos ordenados y cinco tránsitos para P=%s días', periodDays => {
    const result = simulate({ ...scenario, periodDays });
    expect(result.samples).toHaveLength(5001);
    expect(result.durationDays).toBe(5 * periodDays);
    expect(result.cadenceDays).toBe(periodDays / 1000);
    expect(result.samples[0].timeDays).toBe(0);
    expect(result.samples[5000].timeDays).toBe(5 * periodDays);
    let eventCount = 0;
    let previousWasTransit = false;
    for (const [index, sample] of result.samples.entries()) {
      expect(Math.abs(sample.timeDays - periodDays * (index / 1000))).toBeLessThan(1e-12);
      expect(Number.isFinite(sample.timeDays)).toBe(true);
      expect(Number.isFinite(sample.cleanFlux)).toBe(true);
      expect(Number.isFinite(sample.observedFlux)).toBe(true);
      expect(sample.cleanFlux).toBeGreaterThanOrEqual(0);
      expect(sample.cleanFlux).toBeLessThanOrEqual(1);
      if (index > 0) {
        expect(sample.timeDays).toBeGreaterThan(result.samples[index - 1].timeDays);
        expect(Math.abs(sample.timeDays - result.samples[index - 1].timeDays - periodDays / 1000)).toBeLessThan(1e-12);
      }
      if (index >= 1000) {
        expect(Math.abs(sample.cleanFlux - result.samples[index - 1000].cleanFlux)).toBeLessThan(1e-10);
      }
      const isTransit = sample.cleanFlux < 1 - 1e-12;
      if (isTransit && !previousWasTransit) eventCount++;
      previousWasTransit = isTransit;
    }
    expect(eventCount).toBe(5);
    for (let orbit = 0; orbit < 5; orbit++) {
      const centre = result.samples[500 + 1000 * orbit];
      expect(Math.abs(centre.timeDays - (orbit + 0.5) * periodDays)).toBeLessThan(1e-12);
      expect(Math.abs(centre.cleanFlux - centreFlux)).toBeLessThan(1e-10);
      expect(result.samples[1000 * orbit].cleanFlux).toBe(1);
    }
    expect(result.samples[5000].cleanFlux).toBe(1);
  });

  it.each([0, 42, 4294967295])('conserva igualdad exacta entre observado y limpio sin ruido para seed=%s', seed => {
    const result = simulate({ ...scenario, seed, noisePpm: 0 });
    expect(result.samples.every(sample => sample.observedFlux === sample.cleanFlux)).toBe(true);
  });

  it('aplica ppm y la secuencia independiente de pares en índices tempranos y dispersos', () => {
    const result = simulate(scenario);
    const fixtures = [
      [0, -1.8404491679307617],
      [1, 1.225908490637386],
      [2, -0.264270457639072],
      [500, -0.06251736873443034],
      [1000, -0.8073636475312397],
      [1500, 1.9462689110874605],
      [2500, 0.6910138353902308],
      [3500, 0.03458434308879648],
      [4500, -0.30690430700565957],
      [5000, -0.7477142094247403],
    ];
    for (const [index, normal] of fixtures) {
      const expectedClean = index % 1000 === 500 ? centreFlux : 1;
      const expectedObserved = expectedClean + 0.0005 * normal;
      expect(Math.abs(result.samples[index].cleanFlux - expectedClean)).toBeLessThan(1e-10);
      expect(Math.abs(result.samples[index].observedFlux - expectedObserved)).toBeLessThan(1e-12);
    }
  });

  it('retiene flujo observado mayor que uno sin recortarlo', () => {
    const result = simulate({ ...scenario, seed: 1 });
    expect(result.samples[0].cleanFlux).toBe(1);
    expect(result.samples[0].observedFlux).toBeGreaterThan(1);
    expect(Math.abs(result.samples[0].observedFlux - 1.002188466826796)).toBeLessThan(1e-12);
    expect(result.samples.some(sample => sample.observedFlux < sample.cleanFlux)).toBe(true);
  });

  it('mantiene la geometría limpia al cambiar ruido y semilla', () => {
    const clean = simulate({ ...scenario, noisePpm: 0 });
    for (const [noisePpm, seed] of [[500, 0], [5000, 4294967295]]) {
      const changed = simulate({ ...scenario, noisePpm, seed });
      expect(changed.durationDays).toBe(clean.durationDays);
      expect(changed.cadenceDays).toBe(clean.cadenceDays);
      expect(changed.samples.map(sample => [sample.timeDays, sample.cleanFlux])).toEqual(clean.samples.map(sample => [sample.timeDays, sample.cleanFlux]));
    }
  });

  it('escala el residuo aditivo con sigma sin cambiar la secuencia', () => {
    const lowerNoise = simulate(scenario);
    const higherNoise = simulate({ ...scenario, noisePpm: 5000 });
    for (let index = 0; index < 5001; index++) {
      const lowerResidual = lowerNoise.samples[index].observedFlux - lowerNoise.samples[index].cleanFlux;
      const higherResidual = higherNoise.samples[index].observedFlux - higherNoise.samples[index].cleanFlux;
      expect(Math.abs(higherResidual - 10 * lowerResidual)).toBeLessThan(1e-12);
    }
  });

  it('reinicia la semilla y reproduce datos aunque se intercale otro escenario', () => {
    const first = simulate(scenario);
    simulate({ ...scenario, seed: 1, periodDays: 13.7, noisePpm: 5000 });
    const repeated = simulate(scenario);
    expect(repeated.durationDays).toBe(first.durationDays);
    expect(repeated.cadenceDays).toBe(first.cadenceDays);
    for (let index = 0; index < 5001; index++) {
      expect(repeated.samples[index].timeDays).toBe(first.samples[index].timeDays);
      expect(repeated.samples[index].cleanFlux).toBe(first.samples[index].cleanFlux);
      expect(Math.abs(repeated.samples[index].observedFlux - first.samples[index].observedFlux)).toBeLessThan(1e-12);
    }
  });

  it('reproduce con semilla cero la secuencia de su estado sustituto', () => {
    const zero = simulate({ ...scenario, seed: 0 });
    const replacement = simulate({ ...scenario, seed: 1831565813 });
    expect(zero.samples).toEqual(replacement.samples);
    expect(Math.abs(zero.samples[0].observedFlux - 0.9992491826983443)).toBeLessThan(1e-12);
    expect(zero.samples[0].observedFlux).not.toBe(zero.samples[1].observedFlux);
  });

  it('usa la API geométrica T101 para el mismo tiempo público', () => {
    const input = { ...scenario, periodDays: 13.7 };
    const result = simulate(input);
    for (const sample of result.samples) {
      expect(sample.cleanFlux).toBe(fluxAt(input, sample.timeDays));
    }
  });

  it('preserva la entrada congelada y devuelve muestras y resultados independientes', () => {
    const input = Object.freeze({ ...scenario });
    const first = simulate(input);
    const second = simulate(input);
    expect(input).toEqual(scenario);
    expect(first).not.toBe(second);
    expect(first.samples).not.toBe(second.samples);
    expect(new Set(first.samples).size).toBe(5001);
    const unaffected = first.samples[1].observedFlux;
    first.samples[0].observedFlux = 0;
    expect(first.samples[1].observedFlux).toBe(unaffected);
    expect(second.samples[0].observedFlux).not.toBe(0);
    expect(simulate(input).samples[0]).toEqual(second.samples[0]);
  });

  for (const [field, values] of [
    ['starRadiusSolar', [0.49, 2.01, NaN, Infinity, -Infinity]],
    ['planetRadiusEarth', [0, 21, NaN, Infinity, -Infinity]],
    ['periodDays', [0, 31, NaN, Infinity, -Infinity]],
    ['noisePpm', [-1, 5001, NaN, Infinity, -Infinity]],
    ['seed', [-1, 4294967296, 0.5, NaN, Infinity, -Infinity]],
  ] as const) {
    it.each(values)('rechaza %s inválido en ' + field + ' sin corregir la entrada', value => {
      const input: Readonly<Scenario> = Object.freeze({ ...scenario, [field]: value });
      expect(() => simulate(input)).toThrow(new RegExp(field));
      expect(input[field]).toBe(value);
    });
  }

  it('expone todos los campos inválidos en el error explícito', () => {
    const invalid = { starRadiusSolar: 0, planetRadiusEarth: 0, periodDays: 0, noisePpm: -1, seed: -1 };
    for (const field of Object.keys(invalid)) {
      expect(() => simulate(invalid)).toThrow(new RegExp(field));
    }
  });
});
