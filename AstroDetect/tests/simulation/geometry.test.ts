import { describe, expect, it } from 'vitest';
import { diskOverlapArea, semiMajorAxisMetres } from '../../src/simulation/geometry';

function integratedOverlap(radiusRatio: number, separation: number): number {
  const left = Math.max(-1, separation - radiusRatio);
  const right = Math.min(1, separation + radiusRatio);
  const intervals = 50000;
  const width = (right - left) / intervals;
  let area = 0;
  for (let index = 0; index < intervals; index++) {
    const coordinate = left + (index + 0.5) * width;
    const starHeight = Math.sqrt(Math.max(0, 1 - coordinate * coordinate));
    const planetCoordinate = coordinate - separation;
    const planetHeight = Math.sqrt(Math.max(0, radiusRatio * radiusRatio - planetCoordinate * planetCoordinate));
    area += 2 * Math.min(starHeight, planetHeight) * width;
  }
  return area;
}

describe('geometría científica', () => {
  it.each([
    [1, 2927699245.193657],
    [5, 8560644525.098671],
    [30, 28266625425.523903],
  ])('convierte el período de %s días a un semieje SI', (periodDays, expectedMetres) => {
    expect(semiMajorAxisMetres(periodDays)).toBeCloseTo(expectedMetres, 3);
  });

  it('cumple la razón de Kepler al multiplicar el período por ocho', () => {
    expect(semiMajorAxisMetres(8) / semiMajorAxisMetres(1)).toBeCloseTo(4, 13);
  });

  it('resuelve discos separados, tangencia externa y contención completa', () => {
    expect(diskOverlapArea(1, 0.1, 1.2)).toBe(0);
    expect(diskOverlapArea(1, 0.1, 1.1)).toBe(0);
    expect(diskOverlapArea(1, 0.1, 0)).toBeCloseTo(Math.PI / 100, 14);
    expect(diskOverlapArea(1, 0.1, 0.9)).toBeCloseTo(Math.PI / 100, 14);
    expect(diskOverlapArea(0.1, 1, 0)).toBeCloseTo(Math.PI / 100, 14);
  });

  it('reproduce la lente exacta de dos círculos unitarios', () => {
    const expected = 2 * Math.PI / 3 - Math.sqrt(3) / 2;
    expect(diskOverlapArea(1, 1, 1)).toBeCloseTo(expected, 13);
  });

  it.each([0.85, 1, 1.15])('concuerda con integración independiente para separación %s', separation => {
    const expected = integratedOverlap(0.2, separation);
    expect(Math.abs(diskOverlapArea(1, 0.2, separation) - expected)).toBeLessThan(2e-8);
  });

  it('el área escala con el cuadrado de la unidad de longitud', () => {
    const expectedUnitArea = 2 * Math.PI / 3 - Math.sqrt(3) / 2;
    expect(diskOverlapArea(1000, 1000, 1000) / 1e6).toBeCloseTo(expectedUnitArea, 13);
  });

  it.each([6378100 / (2 * 695700000), 20 * 6378100 / (0.5 * 695700000)])('permanece finita y continua cerca de contactos para r/R=%s', radiusRatio => {
    const maximumArea = Math.PI * radiusRatio * radiusRatio;
    const contacts = [1 - radiusRatio, 1 + radiusRatio];
    for (const contact of contacts) {
      const areas = [-1e-10, -1e-12, 0, 1e-12, 1e-10].map(offset => diskOverlapArea(1, radiusRatio, contact + offset));
      for (const area of areas) {
        expect(Number.isFinite(area)).toBe(true);
        expect(area).toBeGreaterThanOrEqual(0);
        expect(area).toBeLessThanOrEqual(maximumArea * (1 + 2 * Number.EPSILON));
      }
      expect(Math.max(...areas) - Math.min(...areas)).toBeLessThan(1e-8);
    }
  });
});
