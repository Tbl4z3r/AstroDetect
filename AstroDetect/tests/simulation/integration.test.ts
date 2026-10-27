import { describe, expect, it } from 'vitest';
import { detectTransits } from '../../src/analysis';
import { DEFAULT_DETECTION_OPTIONS } from '../../src/contracts';
import { simulate } from '../../src/simulation';
import { negativeSeeds, observedOnly, simulatedCases } from '../fixtures/transit-cases';

describe('T302 simulator to isolated detector', () => {
  it.each(simulatedCases)('checks the predefined outcome for $id', fixture => {
    const simulation = simulate(fixture.scenario);
    const observations = observedOnly(simulation);
    expect(observations.every(sample => Object.keys(sample).sort().join(',') === 'flux,timeDays')).toBe(true);
    expect(observations.map(sample => sample.flux)).toEqual(simulation.samples.map(sample => sample.observedFlux));
    const result = detectTransits(observations, DEFAULT_DETECTION_OPTIONS);
    console.log(JSON.stringify({ fixture: fixture.id, scenario: fixture.scenario, options: DEFAULT_DETECTION_OPTIONS,
      cadenceDays: simulation.cadenceDays, sampleCount: observations.length, result }));
    expect(result.events).toHaveLength(fixture.expectedEvents);
    expect(result.status).toBe(fixture.expectedEvents ? 'candidate' : 'no-evidence');
    if (fixture.expectedPeriodDays === null) expect(result.estimatedPeriodDays).toBeNull();
    else {
      expect(result.estimatedPeriodDays).not.toBeNull();
      expect(Math.abs(result.estimatedPeriodDays! - fixture.expectedPeriodDays)).toBeLessThanOrEqual(2 * simulation.cadenceDays);
      result.events.forEach((event, index) => {
        expect(Math.abs(event.centerDays - (index + 0.5) * fixture.scenario.periodDays)).toBeLessThanOrEqual(2 * simulation.cadenceDays);
        expect(event.sampleCount).toBeGreaterThanOrEqual(DEFAULT_DETECTION_OPTIONS.minSamples);
        expect(event.depth).toBeGreaterThan(0);
      });
    }
    const repeated = simulate(fixture.scenario);
    expect(observedOnly(repeated)).toEqual(observations);
    expect(detectTransits(observedOnly(repeated), DEFAULT_DETECTION_OPTIONS)).toEqual(result);
    expect(simulation.samples.filter(sample => sample.cleanFlux < 1)).not.toHaveLength(0);
  });

  it.each(negativeSeeds)('records signal-removed simulator noise for fixed seed %i', seed => {
    const scenario = { starRadiusSolar: 1, planetRadiusEarth: 10, periodDays: 5, noisePpm: 5000, seed };
    const simulation = simulate(scenario);
    const observations = simulation.samples.map(sample => ({ timeDays: sample.timeDays,
      flux: 1 + (sample.observedFlux - sample.cleanFlux) }));
    const result = detectTransits(observations, DEFAULT_DETECTION_OPTIONS);
    console.log(JSON.stringify({ fixture: 'simulator-residual-noise', scenario, options: DEFAULT_DETECTION_OPTIONS, result }));
    expect(result).toMatchObject({ status: 'no-evidence', events: [], estimatedPeriodDays: null });
    const repeated = simulate(scenario).samples.map(sample => ({ timeDays: sample.timeDays,
      flux: 1 + (sample.observedFlux - sample.cleanFlux) }));
    expect(repeated).toEqual(observations);
    expect(detectTransits(repeated, DEFAULT_DETECTION_OPTIONS)).toEqual(result);
  });

  it('does not let the adapter read the clean curve or scenario metadata', () => {
    const samples = [{ timeDays: 0, observedFlux: 1,
      get cleanFlux(): number { throw new Error('Clean flux must not be read'); } }];
    expect(observedOnly({ samples, durationDays: 0, cadenceDays: 1 })).toEqual([{ timeDays: 0, flux: 1 }]);
  });
});
