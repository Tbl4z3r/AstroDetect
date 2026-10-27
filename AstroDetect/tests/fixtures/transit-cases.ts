import type { Observation, Scenario, SimulationResult } from '../../src/contracts';

export const negativeSeeds = [1, 7, 42, 2026, 123456] as const;

export const simulatedCases: { id: string; scenario: Scenario; expectedEvents: number; expectedPeriodDays: number | null }[] = [
  { id: 'clear-clean', scenario: { starRadiusSolar: 1, planetRadiusEarth: 20, periodDays: 5, noisePpm: 0, seed: 42 }, expectedEvents: 5, expectedPeriodDays: 5 },
  { id: 'clear-noisy', scenario: { starRadiusSolar: 1, planetRadiusEarth: 20, periodDays: 5, noisePpm: 500, seed: 42 }, expectedEvents: 5, expectedPeriodDays: 5 },
  { id: 'weak-noisy', scenario: { starRadiusSolar: 2, planetRadiusEarth: 1, periodDays: 5, noisePpm: 5000, seed: 42 }, expectedEvents: 0, expectedPeriodDays: null },
];

export function observedOnly(result: SimulationResult): Observation[] {
  return result.samples.map(({ timeDays, observedFlux }) => ({ timeDays, flux: observedFlux }));
}

export function independentNoise(seed: number): Observation[] {
  let state = seed;
  const uniform = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return (state + 0.5) / 4294967296;
  };
  return Array.from({ length: 5001 }, (_, index) => ({ timeDays: index / 1000,
    flux: 1 + 0.001 * Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform()) }));
}

export function artificialDimming(centers = [100, 200, 300]): Observation[] {
  return Array.from({ length: 401 }, (_, index) => ({ timeDays: index / 100,
    flux: centers.some(center => Math.abs(index - center) <= 2) ? 0.99 : 1 }));
}
