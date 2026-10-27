import { describe, expect, it } from 'vitest';
import { DEFAULT_DETECTION_OPTIONS as defaults } from '../../src/contracts';
import type { Observation, TransitDetector } from '../../src/contracts';
import { detectTransits } from '../../src/analysis';

const detector: TransitDetector = detectTransits;

function series(centers: number[] = [], width = 5, depth = 0.01): Observation[] {
  return Array.from({ length: 401 }, (_, index) => ({ timeDays: index / 100,
    flux: centers.some(center => Math.abs(index - center) <= (width - 1) / 2) ? 1 - depth : 1 }));
}

function noise(seed: number): Observation[] {
  let state = seed;
  const uniform = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return (state + 0.5) / 4294967296;
  };
  return Array.from({ length: 1001 }, (_, index) => ({ timeDays: index / 100,
    flux: 1 + 0.001 * Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform()) }));
}

describe('detectTransits', () => {
  it('returns no evidence for a constant series with zero MAD', () => {
    expect(detector(series(), defaults)).toMatchObject({ status: 'no-evidence', events: [], estimatedPeriodDays: null });
  });

  it('recovers three rectangular decreases and their observed repetition', () => {
    const result = detector(series([100, 200, 300]), defaults);
    expect(result.status).toBe('candidate');
    expect(result.estimatedPeriodDays).toBeCloseTo(1, 12);
    expect(result.events).toHaveLength(3);
    expect(result.events[0]).toMatchObject({ startDays: 0.98, endDays: 1.02, centerDays: 1, sampleCount: 5 });
    expect(result.events[0].depth).toBeCloseTo(0.01, 12);
    expect(result.warnings.join(' ')).toContain('no confirma un planeta');
  });

  it.each([[100], [100, 200]])('retains events without enough repetitions: %j', (...centers) => {
    const result = detector(series(centers), defaults);
    expect(result.events).toHaveLength(centers.length);
    expect(result.estimatedPeriodDays).toBeNull();
    expect(result.warnings.join(' ')).toContain('suficientes eventos');
  });

  it('rejects short groups and does not join separated groups', () => {
    const samples = series();
    for (const index of [10, 30, 31, 60, 61, 63, 64]) samples[index].flux = 0.9;
    expect(detector(samples, defaults).events).toEqual([]);
  });

  it.each([[50, 150, 350], [50, 120, 300]])('rejects irregular or missing-event repetition: %j', (...centers) => {
    const result = detector(series(centers), defaults);
    expect(result.events).toHaveLength(3);
    expect(result.estimatedPeriodDays).toBeNull();
    expect(result.warnings.join(' ')).toContain('inconsistente');
  });

  it('flags irregular cadence without merging separated events', () => {
    const samples = series([100, 200, 300]);
    samples[10].timeDays += 0.003;
    expect(detector(samples, defaults).warnings.join(' ')).toContain('orientativa');
  });

  it('honors all algorithm options', () => {
    const samples = series([100, 200, 300]);
    expect(detector(samples, { ...defaults, minSamples: 6 }).events).toEqual([]);
    expect(detector(samples.slice(0, 10), { ...defaults, minSamples: 11 }).status).toBe('insufficient-data');
    expect(detector(samples, { ...defaults, minEventsForPeriod: 4 }).estimatedPeriodDays).toBeNull();
    expect(detector(samples, { ...defaults, noiseFloor: 0.003 }).events).toEqual([]);
    expect(detector(samples, { ...defaults, noiseFloor: 0.003, thresholdSigma: 2 }).events).toHaveLength(3);
    const irregular = series([50, 150, 280]);
    expect(detector(irregular, defaults).estimatedPeriodDays).toBeNull();
    expect(detector(irregular, { ...defaults, periodToleranceFraction: 0.2 }).estimatedPeriodDays).toBeCloseTo(1.15);
  });

  it.each([0, 1, 6])('returns insufficient data for %i valid observations', length => {
    expect(detector(series().slice(0, length), defaults).status).toBe('insufficient-data');
  });

  it.each([NaN, Infinity, -Infinity])('rejects nonfinite data even in a short series: %s', value => {
    expect(() => detector([{ timeDays: value, flux: 1 }], defaults)).toThrow();
    expect(() => detector([{ timeDays: 0, flux: value }], defaults)).toThrow();
  });

  it('rejects duplicate or descending times and nonpositive baselines', () => {
    expect(() => detector([{ timeDays: 1, flux: 1 }, { timeDays: 1, flux: 1 }], defaults)).toThrow();
    expect(() => detector([{ timeDays: 1, flux: 1 }, { timeDays: 0, flux: 1 }], defaults)).toThrow();
    for (const flux of [0, -1]) expect(() => detector(series().map(sample => ({ ...sample, flux })), defaults)).toThrow();
  });

  it.each([
    { thresholdSigma: 0 }, { thresholdSigma: NaN }, { noiseFloor: -1 }, { noiseFloor: Infinity },
    { minSamples: 2 }, { minSamples: 3.5 }, { minEventsForPeriod: 2 }, { minEventsForPeriod: 3.5 },
    { periodToleranceFraction: 0 }, { periodToleranceFraction: 1 }, { periodToleranceFraction: NaN },
  ])('validates options before even an empty series: %j', invalid => {
    expect(() => detector([], { ...defaults, ...invalid })).toThrow();
  });

  it('uses MAD and can miss shallow signals amid noise', () => {
    const samples = noise(42);
    for (let index = 98; index <= 102; index++) samples[index].flux -= 0.0001;
    expect(detector(samples, defaults).status).toBe('no-evidence');
  });

  it.each([1, 7, 42, 2026, 123456])('freezes independent Gaussian noise outcome for seed %i', seed => {
    expect(detector(noise(seed), defaults)).toMatchObject({ status: 'no-evidence', events: [], estimatedPeriodDays: null });
  });

  it('is deterministic, preserves inputs and ignores non-observation metadata', () => {
    const samples = series([100, 200, 300]).map(sample => Object.freeze({ ...sample,
      get cleanFlux(): number { throw new Error('Forbidden metadata'); },
      get periodDays(): number { throw new Error('Forbidden metadata'); } }));
    Object.freeze(samples);
    expect(detector(samples, defaults)).toEqual(detector(samples, defaults));
  });

  it('keeps threshold strict and returns groups at observation boundaries', () => {
    expect(detector(series([100], 5, 0.125), { ...defaults, thresholdSigma: 1, noiseFloor: 0.125 }).events).toEqual([]);
    const result = detector(series([2, 398]), defaults);
    expect(result.events.map(event => event.sampleCount)).toEqual([5, 5]);
  });

  it('rejects unrepresentable arithmetic rather than returning infinite fields', () => {
    expect(() => detector(series(), { ...defaults, thresholdSigma: Number.MAX_VALUE, noiseFloor: 2 })).toThrow();
  });
});
