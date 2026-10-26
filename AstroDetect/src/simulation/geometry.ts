import { PHYSICAL_CONSTANTS } from '../contracts';

export function semiMajorAxisMetres(periodDays: number): number {
  const periodSeconds = periodDays * PHYSICAL_CONSTANTS.secondsPerDay;
  return Math.cbrt(
    PHYSICAL_CONSTANTS.solarGravitationalParameter * periodSeconds ** 2 / (4 * Math.PI ** 2),
  );
}

export function diskOverlapArea(starRadius: number, planetRadius: number, separation: number): number {
  if (separation >= starRadius + planetRadius) return 0;
  const maximumArea = Math.PI * Math.min(starRadius, planetRadius) ** 2;
  if (separation <= Math.abs(starRadius - planetRadius)) return maximumArea;

  const separationSquared = separation ** 2;
  const starSquared = starRadius ** 2;
  const planetSquared = planetRadius ** 2;
  const starCosine = (separationSquared + starSquared - planetSquared) / (2 * separation * starRadius);
  const planetCosine = (separationSquared + planetSquared - starSquared) / (2 * separation * planetRadius);
  const radicand = (-separation + starRadius + planetRadius)
    * (separation + starRadius - planetRadius)
    * (separation - starRadius + planetRadius)
    * (separation + starRadius + planetRadius);
  const area = starSquared * Math.acos(Math.max(-1, Math.min(1, starCosine)))
    + planetSquared * Math.acos(Math.max(-1, Math.min(1, planetCosine)))
    - 0.5 * Math.sqrt(Math.max(0, radicand));
  return Math.max(0, Math.min(maximumArea, area));
}
