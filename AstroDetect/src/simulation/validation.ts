import { PHYSICAL_CONSTANTS, SCENARIO_LIMITS } from '../contracts';
import type { Scenario, ValidationResult } from '../contracts';
import { semiMajorAxisMetres } from './geometry';

export function validateScenario(scenario: Scenario): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  for (const field of Object.keys(SCENARIO_LIMITS) as (keyof Scenario)[]) {
    const value = scenario[field];
    const { min, max } = SCENARIO_LIMITS[field];
    if (!Number.isFinite(value) || value < min || value > max) {
      errors.push({ field, message: `Debe ser un número finito entre ${min} y ${max}.` });
    } else if (field === 'seed' && !Number.isInteger(value)) {
      errors.push({ field, message: 'Debe ser un entero sin signo de 32 bits.' });
    }
  }

  if (errors.length === 0) {
    const starRadius = scenario.starRadiusSolar * PHYSICAL_CONSTANTS.solarRadiusMetres;
    const planetRadius = scenario.planetRadiusEarth * PHYSICAL_CONSTANTS.earthRadiusMetres;
    if (semiMajorAxisMetres(scenario.periodDays) <= starRadius + planetRadius) {
      errors.push({ field: 'periodDays', message: 'La órbita debe separar los discos físicos de la estrella y el planeta.' });
    }
  }
  return { valid: errors.length === 0, errors };
}
