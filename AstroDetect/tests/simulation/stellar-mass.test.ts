import { describe, expect, it } from 'vitest';
import type { Scenario } from '../../src/contracts';
import { fluxAt, positionAt, simulate, validateScenario } from '../../src/simulation';

const legacy: Scenario = { starRadiusSolar: 1, planetRadiusEarth: 10, periodDays: 5, noisePpm: 500, seed: 42 };
const boundaryCases: Scenario[] = [];
for (const starMassSolar of [0.2, 1.6]) for (const starRadiusSolar of [0.2, 2])
  for (const planetRadiusEarth of [1, 20]) for (const periodDays of [1, 30])
    for (const noisePpm of [0, 5000]) for (const seed of [0, 4294967295])
      boundaryCases.push({ starMassSolar, starRadiusSolar, planetRadiusEarth, periodDays, noisePpm, seed });

describe('masa estelar y compatibilidad solar', () => {
  it('recupera exactamente las posiciones, flujos y serie del escenario sin masa', () => {
    const solar = { ...legacy, starMassSolar: 1 };
    const undefinedMass = { ...legacy, starMassSolar: undefined };
    for (const timeDays of [-5, 0, 1.25, 2.435, 2.5, 2.565, 3.75, 25]) {
      expect(positionAt(legacy, timeDays)).toEqual(positionAt(solar, timeDays));
      expect(positionAt(undefinedMass, timeDays)).toEqual(positionAt(solar, timeDays));
      expect(fluxAt(legacy, timeDays)).toBe(fluxAt(solar, timeDays));
    }
    expect(positionAt(legacy, 1.25).xOverStarRadius).toBeCloseTo(-12.305080530542865, 11);
    expect(fluxAt(legacy, 2.5)).toBeCloseTo(0.991594982122775, 14);
    expect(simulate(legacy)).toEqual(simulate(solar));
    expect(simulate(undefinedMass)).toEqual(simulate(solar));
    expect(legacy).not.toHaveProperty('starMassSolar');
  });

  it('la masa cambia distancia y contactos sin cambiar la fase ni la profundidad central', () => {
    const lower = { ...legacy, starRadiusSolar: 0.2, planetRadiusEarth: 1, starMassSolar: 0.2 };
    const higher = { ...lower, starMassSolar: 1.6 };
    const lowPosition = positionAt(lower, 1.25);
    const highPosition = positionAt(higher, 1.25);
    expect(lowPosition.xOverStarRadius).toBeCloseTo(-5006295288.384674 / 139140000, 11);
    expect(highPosition.xOverStarRadius / lowPosition.xOverStarRadius).toBeCloseTo(2, 13);
    const expectedCentralFlux = 1 - (6378100 / 139140000) ** 2;
    for (const input of [lower, higher]) {
      for (let orbit = 0; orbit < 5; orbit++) {
        expect(fluxAt(input, 2.5 + 5 * orbit)).toBeCloseTo(expectedCentralFlux, 13);
        expect(positionAt(input, 2.5 + 5 * orbit).inFront).toBe(true);
        expect(fluxAt(input, 5 * orbit)).toBe(1);
        expect(positionAt(input, 5 * orbit).inFront).toBe(false);
      }
    }
    expect(fluxAt(lower, 2.48)).toBeLessThan(1);
    expect(fluxAt(higher, 2.48)).toBe(1);
  });

  it.each([
    { mass: 0.2, contacts: [2.476865939679477, 2.4788943831628902, 2.5211056168371098, 2.523134060320523], duration: 0.04626812064104619 },
    { mass: 1.6, contacts: [2.4884341918596227, 2.489448119506678, 2.510551880493322, 2.5115658081403773], duration: 0.023131616280754472 },
  ])('contactos y duración física independientes para masa $mass M☉', ({ mass, contacts, duration }) => {
    const input = { ...legacy, starRadiusSolar: 0.2, planetRadiusEarth: 1, starMassSolar: mass };
    const centralFlux = 1 - (6378100 / 139140000) ** 2;
    for (const [index, time] of contacts.entries()) {
      expect(fluxAt(input, time)).toBeCloseTo(index === 0 || index === 3 ? 1 : centralFlux, 10);
      expect(Math.abs(fluxAt(input, time - 1e-6) - fluxAt(input, time + 1e-6))).toBeLessThan(1e-6);
    }
    expect(fluxAt(input, contacts[0] - 1e-5)).toBe(1);
    expect(fluxAt(input, contacts[0] + 1e-5)).toBeLessThan(1);
    expect(fluxAt(input, contacts[3] - 1e-5)).toBeLessThan(1);
    expect(fluxAt(input, contacts[3] + 1e-5)).toBe(1);
    let outside = 1.25;
    let inside = 2.5;
    for (let iteration = 0; iteration < 60; iteration++) {
      const middle = (outside + inside) / 2;
      if (fluxAt(input, middle) < 1 - 1e-12) inside = middle;
      else outside = middle;
    }
    expect(Math.abs(2 * (2.5 - (inside + outside) / 2) - duration)).toBeLessThan(1e-6);
  });

  it.each(boundaryCases)('serie finita y física en extremos $starMassSolar/$starRadiusSolar/$planetRadiusEarth/$periodDays/$noisePpm/$seed', input => {
    expect(validateScenario(input)).toEqual({ valid: true, errors: [] });
    const result = simulate(input);
    expect(result.samples).toHaveLength(5001);
    expect(result.durationDays).toBe(5 * input.periodDays);
    expect(result.cadenceDays).toBe(input.periodDays / 1000);
    expect(result.samples.every(sample => Number.isFinite(sample.observedFlux)
      && Number.isFinite(sample.timeDays) && sample.cleanFlux >= 0 && sample.cleanFlux <= 1)).toBe(true);
    const expectedCentralFlux = 1 - (input.planetRadiusEarth * 6378100 / (input.starRadiusSolar * 695700000)) ** 2;
    expect(result.samples[500].cleanFlux).toBeCloseTo(expectedCentralFlux, 12);
    expect(result.samples[0].cleanFlux).toBe(1);
    const orbitMetres = Math.abs(positionAt(input, input.periodDays / 4).xOverStarRadius) * input.starRadiusSolar * 695700000;
    expect(orbitMetres).toBeGreaterThan(input.starRadiusSolar * 695700000 + input.planetRadiusEarth * 6378100);
    if (input.noisePpm === 0) expect(result.samples.every(sample => sample.observedFlux === sample.cleanFlux)).toBe(true);
    expect(result.samples.every((sample, index) => index < 1000
      || Math.abs(sample.cleanFlux - result.samples[index - 1000].cleanFlux) < 1e-10)).toBe(true);
  });
});
