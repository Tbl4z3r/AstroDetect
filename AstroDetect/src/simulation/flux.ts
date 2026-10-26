import { PHYSICAL_CONSTANTS } from '../contracts';
import type { Scenario } from '../contracts';
import { diskOverlapArea } from './geometry';
import { positionAt } from './orbit';

export function fluxAt(scenario: Scenario, timeDays: number): number {
  const position = positionAt(scenario, timeDays);
  if (!position.inFront) return 1;

  const radiusRatio = scenario.planetRadiusEarth * PHYSICAL_CONSTANTS.earthRadiusMetres
    / (scenario.starRadiusSolar * PHYSICAL_CONSTANTS.solarRadiusMetres);
  const area = diskOverlapArea(1, radiusRatio, Math.abs(position.xOverStarRadius));
  return 1 - area / Math.PI;
}
