import { PHYSICAL_CONSTANTS } from '../contracts';

export function semiMajorAxisMetres(periodDays: number, starMassSolar = 1): number {
  const periodSeconds = periodDays * PHYSICAL_CONSTANTS.secondsPerDay;
  return Math.cbrt(
    PHYSICAL_CONSTANTS.solarGravitationalParameter * starMassSolar * periodSeconds ** 2 / (4 * Math.PI ** 2),
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
  const starAngle = Math.acos(Math.max(-1, Math.min(1, starCosine)));
  const planetAngle = Math.acos(Math.max(-1, Math.min(1, planetCosine)));
  const area = starSquared * (starAngle - Math.sin(starAngle) * Math.cos(starAngle))
    + planetSquared * (planetAngle - Math.sin(planetAngle) * Math.cos(planetAngle));
  return Math.max(0, Math.min(maximumArea, area));
}
