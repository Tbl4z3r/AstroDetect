import { PHYSICAL_CONSTANTS } from '../contracts';
import type { Position, Scenario } from '../contracts';
import { semiMajorAxisMetres } from './geometry';
import { validateScenario } from './validation';

export function positionAt(scenario: Scenario, timeDays: number): Position {
  const validation = validateScenario(scenario);
  if (!validation.valid) {
    throw new RangeError(validation.errors.map(error => `${error.field}: ${error.message}`).join(' '));
  }
  if (!Number.isFinite(timeDays)) throw new RangeError('timeDays: debe ser un número finito en días.');

  const remainderDays = timeDays % scenario.periodDays;
  const timeInPeriod = remainderDays < 0 ? remainderDays + scenario.periodDays : remainderDays;
  const cycle = timeInPeriod / scenario.periodDays;
  const phase = 2 * Math.PI * (cycle - 0.5);
  const starRadius = scenario.starRadiusSolar * PHYSICAL_CONSTANTS.solarRadiusMetres;
  return {
    xOverStarRadius: semiMajorAxisMetres(scenario.periodDays) / starRadius * Math.sin(phase),
    yOverStarRadius: 0,
    inFront: cycle > 0.25 && cycle < 0.75,
  };
}
