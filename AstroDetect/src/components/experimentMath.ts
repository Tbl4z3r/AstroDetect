import { PHYSICAL_CONSTANTS } from '../contracts';
import type { Scenario, SimulationResult } from '../contracts';
import { fluxAt } from '../simulation';
import { semiMajorAxisMetres } from '../simulation/geometry';

export function experimentQuantities(scenario: Scenario, result: SimulationResult) {
  const centralFlux = fluxAt(scenario, scenario.periodDays / 2);
  const starRadiusMetres = scenario.starRadiusSolar * PHYSICAL_CONSTANTS.solarRadiusMetres;
  const planetRadiusMetres = scenario.planetRadiusEarth * PHYSICAL_CONSTANTS.earthRadiusMetres;
  const starMassSolar = scenario.starMassSolar ?? 1;
  const gravitationalParameter = PHYSICAL_CONSTANTS.solarGravitationalParameter * starMassSolar;
  const orbitMetres = semiMajorAxisMetres(scenario.periodDays, starMassSolar);
  const durationDays = scenario.periodDays / Math.PI * Math.asin((starRadiusMetres + planetRadiusMetres) / orbitMetres);
  return {
    starRadiusMetres,
    planetRadiusMetres,
    starMassSolar,
    gravitationalParameter,
    radiusRatio: planetRadiusMetres / starRadiusMetres,
    periodSeconds: scenario.periodDays * PHYSICAL_CONSTANTS.secondsPerDay,
    orbitMetres,
    centralFlux,
    depth: 1 - centralFlux,
    durationDays,
    cadenceSeconds: result.cadenceDays * PHYSICAL_CONSTANTS.secondsPerDay,
    noiseSigma: scenario.noisePpm * 1e-6,
  };
}

export function formatExperimentNumber(value: number, maximumFractionDigits = 4): string {
  if (value !== 0 && maximumFractionDigits > 0 && Math.abs(value) < 10 ** -maximumFractionDigits)
    return value.toLocaleString('es-CL', { notation: 'scientific', maximumFractionDigits: 4 });
  return value.toLocaleString('es-CL', { maximumFractionDigits });
}

export function formatExperimentOperand(value: number, scientific = false): string {
  const [mantissa, exponent] = (scientific ? value.toExponential() : String(value)).split('e');
  const [integer, fraction] = mantissa.split('.');
  const localizedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${localizedInteger}${fraction === undefined ? '' : `,${fraction}`}${exponent === undefined ? '' : `E${exponent}`}`;
}
