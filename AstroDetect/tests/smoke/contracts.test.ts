import { describe, expect, it } from 'vitest';
import { DEFAULT_DETECTION_OPTIONS, DEFAULT_SCENARIO, SCENARIO_LIMITS, validateDetectionOptions } from '../../src/contracts';
describe('contrato v1', () => {
  it('conserva valores iniciales y límites acordados', () => {
    expect(DEFAULT_SCENARIO).toEqual({ starRadiusSolar: 1, planetRadiusEarth: 10, periodDays: 5, noisePpm: 500, seed: 42 });
    expect(SCENARIO_LIMITS.seed).toEqual({ min: 0, max: 4294967295 });
    expect(validateDetectionOptions(DEFAULT_DETECTION_OPTIONS)).toEqual({ valid: true, errors: [] });
  });
  for (const field of ['thresholdSigma', 'noiseFloor', 'minSamples', 'minEventsForPeriod', 'periodToleranceFraction'] as const) {
    for (const value of [NaN, Infinity, -Infinity, 0, -1]) {
      it(field + ' rechaza ' + value, () => {
        const result = validateDetectionOptions({ ...DEFAULT_DETECTION_OPTIONS, [field]: value });
        expect(result.valid).toBe(false);
        expect(result.errors.some(error => error.field === field)).toBe(true);
      });
    }
  }
  it('valida límites abiertos, enteros y errores simultáneos sin corregir', () => {
    expect(validateDetectionOptions({ ...DEFAULT_DETECTION_OPTIONS, periodToleranceFraction: 1 }).valid).toBe(false);
    expect(validateDetectionOptions({ ...DEFAULT_DETECTION_OPTIONS, minSamples: 3.5 }).valid).toBe(false);
    expect(validateDetectionOptions({ ...DEFAULT_DETECTION_OPTIONS, minEventsForPeriod: 2 }).valid).toBe(false);
    const invalid = { thresholdSigma: 0, noiseFloor: NaN, minSamples: 1, minEventsForPeriod: 1, periodToleranceFraction: 1 };
    expect(validateDetectionOptions(invalid).errors).toHaveLength(5);
    expect(invalid.thresholdSigma).toBe(0);
    expect(validateDetectionOptions({ thresholdSigma: 0.01, noiseFloor: 1e-12, minSamples: 4, minEventsForPeriod: 5, periodToleranceFraction: 0.99 }).valid).toBe(true);
  });
});
