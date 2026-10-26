export interface Scenario {
  starRadiusSolar: number;
  planetRadiusEarth: number;
  periodDays: number;
  noisePpm: number;
  seed: number;
}
export interface ValidationResult { valid: boolean; errors: { field: string; message: string }[] }
export interface Position { xOverStarRadius: number; yOverStarRadius: number; inFront: boolean }
export interface LightSample { timeDays: number; cleanFlux: number; observedFlux: number }
export interface SimulationResult { samples: LightSample[]; durationDays: number; cadenceDays: number }
export interface Observation { timeDays: number; flux: number }
export interface DetectionOptions {
  thresholdSigma: number;
  minSamples: number;
  minEventsForPeriod: number;
  periodToleranceFraction: number;
  noiseFloor: number;
}
export interface TransitCandidate { startDays: number; endDays: number; centerDays: number; depth: number; sampleCount: number }
export interface DetectionResult {
  status: 'candidate' | 'no-evidence' | 'insufficient-data';
  events: TransitCandidate[];
  estimatedPeriodDays: number | null;
  warnings: string[];
}
export interface SimulationEngine {
  validateScenario: (scenario: Scenario) => ValidationResult;
  positionAt: (scenario: Scenario, timeDays: number) => Position;
  fluxAt: (scenario: Scenario, timeDays: number) => number;
  simulate: (scenario: Scenario) => SimulationResult;
}
export type TransitDetector = (observations: Observation[], options: DetectionOptions) => DetectionResult;
export const CONTRACT_VERSION = '1.0.0';
export const MODEL_VERSION = '1.0.0';
export const SCENARIO_LIMITS = Object.freeze({
  starRadiusSolar: Object.freeze({ min: 0.5, max: 2 }),
  planetRadiusEarth: Object.freeze({ min: 1, max: 20 }),
  periodDays: Object.freeze({ min: 1, max: 30 }),
  noisePpm: Object.freeze({ min: 0, max: 5000 }),
  seed: Object.freeze({ min: 0, max: 4294967295 }),
});
export const DEFAULT_SCENARIO: Readonly<Scenario> = Object.freeze({
  starRadiusSolar: 1, planetRadiusEarth: 10, periodDays: 5, noisePpm: 500, seed: 42,
});
export const DEFAULT_DETECTION_OPTIONS: Readonly<DetectionOptions> = Object.freeze({
  thresholdSigma: 4, minSamples: 3, minEventsForPeriod: 3, periodToleranceFraction: 0.10, noiseFloor: 1e-8,
});
export const PHYSICAL_CONSTANTS = Object.freeze({
  solarRadiusMetres: 695700000,
  earthRadiusMetres: 6378100,
  solarGravitationalParameter: 1.3271244e20,
  secondsPerDay: 86400,
});
export const SAMPLING = Object.freeze({ periods: 5, intervals: 5000, samples: 5001 });
export const NOISE_CONVENTION = Object.freeze({
  generator: 'xorshift32', zeroSeedState: 1831565813, shifts: Object.freeze([13, 17, 5]),
  uniformDivisor: 4294967296, uniformOffset: 0.5, uniformsPerSample: 2,
  gaussianTransform: 'box-muller-cosine-discard-sine',
});
export function validateDetectionOptions(options: DetectionOptions): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  for (const field of ['thresholdSigma', 'noiseFloor'] as const) {
    if (!Number.isFinite(options[field]) || options[field] <= 0)
      errors.push({ field, message: 'Debe ser un número finito mayor que cero.' });
  }
  for (const field of ['minSamples', 'minEventsForPeriod'] as const) {
    if (!Number.isInteger(options[field]) || options[field] < 3)
      errors.push({ field, message: 'Debe ser un entero de al menos 3.' });
  }
  if (!Number.isFinite(options.periodToleranceFraction) || options.periodToleranceFraction <= 0 || options.periodToleranceFraction >= 1)
    errors.push({ field: 'periodToleranceFraction', message: 'Debe ser un número finito mayor que cero y menor que uno.' });
  return { valid: errors.length === 0, errors };
}
