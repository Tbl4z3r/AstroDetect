import { describe, expect, it } from 'vitest';
import { DEFAULT_SCENARIO } from '../../src/contracts';
import { fluxAt, positionAt } from '../../src/simulation';

const scenario = { ...DEFAULT_SCENARIO };
const centreFlux = 0.991594982122775;
const contacts = [2.429307726766928, 2.4412050152903686, 2.5587949847096314, 2.570692273233072];

describe('órbita y flujo ideal', () => {
  it.each([
    [0, 0, false],
    [1.25, -12.305080530542865, false],
    [2.5, 0, true],
    [3.75, 12.305080530542865, false],
    [5, 0, false],
  ] as const)('conserva fase, proyección y unidades en t=%s días', (timeDays, expectedX, inFront) => {
    const position = positionAt(scenario, timeDays);
    expect(position.xOverStarRadius).toBeCloseTo(expectedX, 11);
    expect(position.yOverStarRadius).toBe(0);
    expect(position.inFront).toBe(inFront);
  });

  it('presenta cinco centros delanteros y evita eclipses traseros', () => {
    for (let orbit = 0; orbit < 5; orbit++) {
      expect(Math.abs(fluxAt(scenario, 2.5 + 5 * orbit) - centreFlux)).toBeLessThan(1e-10);
      expect(fluxAt(scenario, 5 * orbit)).toBe(1);
      expect(positionAt(scenario, 2.5 + 5 * orbit).inFront).toBe(true);
      expect(positionAt(scenario, 5 * orbit).inFront).toBe(false);
    }
    expect(fluxAt(scenario, 25)).toBe(1);
  });

  it.each([-7, -1, 1, 8])('es periódica en posición y flujo tras %s vueltas', orbitOffset => {
    for (const timeDays of [0, 1.25, 2.435, 2.5, 2.565, 3.75, 5]) {
      const original = positionAt(scenario, timeDays);
      const repeated = positionAt(scenario, timeDays + 5 * orbitOffset);
      expect(repeated.xOverStarRadius).toBeCloseTo(original.xOverStarRadius, 11);
      expect(repeated.yOverStarRadius).toBe(0);
      expect(repeated.inFront).toBe(original.inFront);
      expect(Math.abs(fluxAt(scenario, timeDays + 5 * orbitOffset) - fluxAt(scenario, timeDays))).toBeLessThan(1e-10);
    }
  });

  it('es simétrica respecto al centro delantero durante ingreso y egreso', () => {
    for (const offset of [0, 0.01, 0.06, 0.065, 0.07, 0.1]) {
      expect(Math.abs(fluxAt(scenario, 2.5 - offset) - fluxAt(scenario, 2.5 + offset))).toBeLessThan(1e-10);
      expect(positionAt(scenario, 2.5 - offset).xOverStarRadius).toBeCloseTo(-positionAt(scenario, 2.5 + offset).xOverStarRadius, 11);
    }
  });

  it('reproduce un flujo parcial obtenido por integración de secciones de discos', () => {
    expect(Math.abs(fluxAt(scenario, 2.564741816043867) - 0.9958792674903914)).toBeLessThan(1e-10);
  });

  it('mantiene continuidad y los niveles físicos en los cuatro contactos', () => {
    contacts.forEach((timeDays, index) => {
      const expectedFlux = index === 0 || index === 3 ? 1 : centreFlux;
      const atContact = fluxAt(scenario, timeDays);
      const before = fluxAt(scenario, timeDays - 1e-5);
      const after = fluxAt(scenario, timeDays + 1e-5);
      expect(Math.abs(atContact - expectedFlux)).toBeLessThan(1e-10);
      expect(Math.abs(before - after)).toBeLessThan(1e-6);
      expect(Number.isFinite(before)).toBe(true);
      expect(Number.isFinite(after)).toBe(true);
    });
    expect(fluxAt(scenario, contacts[0] - 1e-5)).toBe(1);
    expect(fluxAt(scenario, contacts[0] + 1e-5)).toBeLessThan(1);
    expect(fluxAt(scenario, contacts[1] - 1e-5)).toBeGreaterThan(centreFlux);
    expect(Math.abs(fluxAt(scenario, contacts[1] + 1e-5) - centreFlux)).toBeLessThan(1e-10);
    expect(Math.abs(fluxAt(scenario, contacts[2] - 1e-5) - centreFlux)).toBeLessThan(1e-10);
    expect(fluxAt(scenario, contacts[2] + 1e-5)).toBeGreaterThan(centreFlux);
    expect(fluxAt(scenario, contacts[3] - 1e-5)).toBeLessThan(1);
    expect(fluxAt(scenario, contacts[3] + 1e-5)).toBe(1);
  });

  it.each([
    [1, 0.08352882790717252],
    [5, 0.14138454646614354],
    [30, 0.25660587742664986],
  ])('obtiene duración de tránsito analítica para P=%s días', (periodDays, expectedDuration) => {
    const input = { ...scenario, periodDays };
    const centre = periodDays / 2;
    let outside = periodDays / 4;
    let inside = centre;
    for (let iteration = 0; iteration < 60; iteration++) {
      const midpoint = (outside + inside) / 2;
      if (fluxAt(input, midpoint) < 1 - 1e-12) inside = midpoint;
      else outside = midpoint;
    }
    const measuredDuration = 2 * (centre - (outside + inside) / 2);
    expect(Math.abs(measuredDuration - expectedDuration)).toBeLessThan(1e-6);
  });

  it('cuadruplica la profundidad al duplicar el radio planetario', () => {
    const smallerDepth = 1 - fluxAt({ ...scenario, planetRadiusEarth: 5 }, 2.5);
    const largerDepth = 1 - fluxAt(scenario, 2.5);
    expect(Math.abs(smallerDepth - 0.00210125446930625)).toBeLessThan(1e-10);
    expect(Math.abs(largerDepth - 0.008405017877225)).toBeLessThan(1e-10);
    expect(largerDepth / smallerDepth).toBeCloseTo(4, 11);
  });

  it.each([0.5, 2])('mantiene salidas finitas con radio estelar límite %s', starRadiusSolar => {
    for (const planetRadiusEarth of [1, 20]) {
      for (const periodDays of [1, 30]) {
        const input = { ...scenario, starRadiusSolar, planetRadiusEarth, periodDays };
        for (let index = 0; index <= 1000; index++) {
          const timeDays = periodDays * index / 1000;
          const position = positionAt(input, timeDays);
          const flux = fluxAt(input, timeDays);
          expect(Number.isFinite(position.xOverStarRadius)).toBe(true);
          expect(position.yOverStarRadius).toBe(0);
          expect(Number.isFinite(flux)).toBe(true);
          expect(flux).toBeGreaterThanOrEqual(0);
          expect(flux).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it.each([
    [0.5, 20, 0.865519713964397],
    [2, 1, 0.999978987455307],
  ])('conserva profundidad de radios extremos %s y %s', (starRadiusSolar, planetRadiusEarth, expectedFlux) => {
    expect(Math.abs(fluxAt({ ...scenario, starRadiusSolar, planetRadiusEarth }, 2.5) - expectedFlux)).toBeLessThan(1e-10);
  });

  it('es determinista y conserva una entrada congelada', () => {
    const frozenInput = Object.freeze({ ...scenario });
    const position = positionAt(frozenInput, 2.565);
    const flux = fluxAt(frozenInput, 2.565);
    expect(positionAt(frozenInput, 2.565)).toEqual(position);
    expect(fluxAt(frozenInput, 2.565)).toBe(flux);
    expect(frozenInput).toEqual(scenario);
    for (const noisePpm of [0, 5000]) {
      for (const seed of [0, 4294967295]) {
        const changedInput = { ...frozenInput, noisePpm, seed };
        expect(positionAt(changedInput, 2.565)).toEqual(position);
        expect(fluxAt(changedInput, 2.565)).toBe(flux);
      }
    }
  });
});
