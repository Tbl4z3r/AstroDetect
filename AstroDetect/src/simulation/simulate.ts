import { SAMPLING } from '../contracts';
import type { Scenario, SimulationResult } from '../contracts';
import { fluxAt } from './flux';
import { createGaussianRandom } from './random';
import { validateScenario } from './validation';

export function simulate(scenario: Scenario): SimulationResult {
  const validation = validateScenario(scenario);
  if (!validation.valid) {
    throw new RangeError(validation.errors.map(error => `${error.field}: ${error.message}`).join(' '));
  }

  const durationDays = scenario.periodDays * SAMPLING.periods;
  const intervalsPerPeriod = SAMPLING.intervals / SAMPLING.periods;
  const cadenceDays = scenario.periodDays / intervalsPerPeriod;
  const sigma = scenario.noisePpm * 1e-6;
  const nextGaussian = createGaussianRandom(scenario.seed);
  const samples = Array.from({ length: SAMPLING.samples }, (_, index) => {
    const timeDays = index === SAMPLING.intervals
      ? durationDays
      : index * scenario.periodDays / intervalsPerPeriod;
    const cleanFlux = fluxAt(scenario, timeDays);
    const observedFlux = cleanFlux + sigma * nextGaussian();
    return { timeDays, cleanFlux, observedFlux };
  });
  return { samples, durationDays, cadenceDays };
}
