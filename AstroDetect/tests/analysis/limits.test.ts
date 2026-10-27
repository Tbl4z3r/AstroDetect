import { describe, expect, it } from 'vitest';
import { detectTransits } from '../../src/analysis';
import { DEFAULT_DETECTION_OPTIONS } from '../../src/contracts';
import { artificialDimming, independentNoise, negativeSeeds } from '../fixtures/transit-cases';

describe('T302 independent controls and interpretation limits', () => {
  it.each(negativeSeeds)('records the noise-only outcome fixed in advance for seed %i', seed => {
    const observations = independentNoise(seed);
    const result = detectTransits(observations, DEFAULT_DETECTION_OPTIONS);
    console.log(JSON.stringify({ fixture: 'independent-noise', seed, options: DEFAULT_DETECTION_OPTIONS, result }));
    expect(result).toMatchObject({ status: 'no-evidence', events: [], estimatedPeriodDays: null });
    expect(independentNoise(seed)).toEqual(observations);
    expect(detectTransits(independentNoise(seed), DEFAULT_DETECTION_OPTIONS)).toEqual(result);
  });

  it('accepts periodic instrument-like dimming despite having no planet model', () => {
    const observations = artificialDimming();
    const result = detectTransits(observations, DEFAULT_DETECTION_OPTIONS);
    console.log(JSON.stringify({ fixture: 'artificial-instrument-dimming', options: DEFAULT_DETECTION_OPTIONS, result }));
    expect(result.status).toBe('candidate');
    expect(result.events).toHaveLength(3);
    expect(result.events.map(event => event.centerDays)).toEqual([1, 2, 3]);
    expect(result.events.map(event => event.sampleCount)).toEqual([5, 5, 5]);
    expect(result.estimatedPeriodDays).toBeCloseTo(1, 12);
    expect(result.warnings.join(' ')).toContain('no confirma un planeta');
  });

  it('preserves the independent missing-event control', () => {
    const result = detectTransits(artificialDimming([50, 150, 350]), DEFAULT_DETECTION_OPTIONS);
    expect(result.events).toHaveLength(3);
    expect(result.estimatedPeriodDays).toBeNull();
    expect(result.warnings.join(' ')).toContain('inconsistente');
  });
});
