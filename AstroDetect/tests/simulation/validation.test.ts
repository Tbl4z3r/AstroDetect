import { describe, expect, it } from 'vitest';
import { DEFAULT_SCENARIO, SCENARIO_LIMITS } from '../../src/contracts';
import type { Scenario, SimulationEngine } from '../../src/contracts';
import { fluxAt, positionAt, validateScenario } from '../../src/simulation';

const api = { validateScenario, positionAt, fluxAt } satisfies Pick<
  SimulationEngine, 'validateScenario' | 'positionAt' | 'fluxAt'
>;

describe('validación científica del contrato v1', () => {
  it('acepta valores iniciales y no modifica entradas congeladas', () => {
    expect(api.validateScenario(DEFAULT_SCENARIO)).toEqual({ valid: true, errors: [] });
    expect(() => api.positionAt(DEFAULT_SCENARIO, 2.5)).not.toThrow();
    expect(() => api.fluxAt(DEFAULT_SCENARIO, 2.5)).not.toThrow();
    const invalid = Object.freeze({ ...DEFAULT_SCENARIO, periodDays: NaN, seed: 0.5 });
    const result = validateScenario(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.map(error => error.field)).toEqual(['periodDays', 'seed']);
    expect(invalid.periodDays).toBeNaN();
    expect(invalid.seed).toBe(0.5);
    expect(() => positionAt(invalid, 0)).toThrow(/periodDays.*seed/);
    expect(() => fluxAt(invalid, 0)).toThrow(/periodDays.*seed/);
  });

  for (const field of Object.keys(SCENARIO_LIMITS) as (keyof Scenario)[]) {
    const { min, max } = SCENARIO_LIMITS[field];
    for (const value of [NaN, Infinity, -Infinity, min - 1, max + 1]) {
      it(`${field} rechaza ${value} e informa el campo`, () => {
        const scenario = { ...DEFAULT_SCENARIO, [field]: value };
        const result = validateScenario(scenario);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].field).toBe(field);
        expect(result.errors[0].message.length).toBeGreaterThan(0);
        expect(() => positionAt(scenario, 0)).toThrow(field);
        expect(() => fluxAt(scenario, 0)).toThrow(field);
      });
    }
    for (const value of [min, max]) {
      it(`${field} acepta el límite inclusivo ${value}`, () => {
        expect(validateScenario({ ...DEFAULT_SCENARIO, [field]: value })).toEqual({ valid: true, errors: [] });
      });
    }
  }

  it('rechaza la semilla fraccionaria y acumula todos los campos inválidos', () => {
    expect(validateScenario({ ...DEFAULT_SCENARIO, seed: 1.5 })).toEqual({
      valid: false,
      errors: [{ field: 'seed', message: expect.any(String) }],
    });
    const result = validateScenario({
      starRadiusSolar: 0, planetRadiusEarth: 21, periodDays: Infinity, noisePpm: -1, seed: -1,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.map(error => error.field).sort()).toEqual(Object.keys(SCENARIO_LIMITS).sort());
  });

  for (const timeDays of [NaN, Infinity, -Infinity]) {
    it(`rechaza tiempo no finito ${timeDays} en ambas consultas`, () => {
      expect(() => positionAt(DEFAULT_SCENARIO, timeDays)).toThrow(/timeDays/);
      expect(() => fluxAt(DEFAULT_SCENARIO, timeDays)).toThrow(/timeDays/);
    });
  }

  it('conserva consultas finitas incluso con tiempos grandes representables', () => {
    for (const timeDays of [-Number.MAX_VALUE, -1e12, 0, 1e12, Number.MAX_VALUE]) {
      const position = positionAt(DEFAULT_SCENARIO, timeDays);
      expect(Number.isFinite(position.xOverStarRadius)).toBe(true);
      expect(position.yOverStarRadius).toBe(0);
      expect(typeof position.inFront).toBe('boolean');
      const flux = fluxAt(DEFAULT_SCENARIO, timeDays);
      expect(flux).toBeGreaterThanOrEqual(0);
      expect(flux).toBeLessThanOrEqual(1);
    }
  });
});
