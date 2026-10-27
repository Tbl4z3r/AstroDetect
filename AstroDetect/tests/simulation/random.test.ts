import { describe, expect, it } from 'vitest';
import { createGaussianRandom, createUniformRandom } from '../../src/simulation/random';

function referenceStates(seed: number, count: number): number[] {
  const modulus = 4294967296n;
  let state = BigInt(seed === 0 ? 1831565813 : seed);
  const states: number[] = [];
  for (let index = 0; index < count; index++) {
    state = (state ^ (state * 8192n)) % modulus;
    state = (state ^ (state / 131072n)) % modulus;
    state = (state ^ (state * 32n)) % modulus;
    states.push(Number(state));
  }
  return states;
}

describe('ruido reproducible especificado', () => {
  it.each([
    [1, [270369, 67634689, 2647435461, 307599695, 2398689233, 745495504]],
    [42, [11355432, 2836018348, 476557059, 3648046016, 3759983556, 1441438134]],
    [0, [1085196063, 2447379481, 2618286376, 1701901981, 265159372, 1030440423]],
    [4294967295, [253983, 4228382207, 1958451267, 4056713434, 2049502865, 2560970988]],
  ] as const)('coincide con estados uint32 independientes para seed=%s', (seed, expectedStates) => {
    expect(referenceStates(seed, expectedStates.length)).toEqual(expectedStates);
    const next = createUniformRandom(seed);
    const actualStates = expectedStates.map(() => next() * 4294967296 - 0.5);
    expect(actualStates).toEqual(expectedStates);
  });

  it.each([0, 1, 42, 4294967295])('conserva 10002 uniformes abiertos y exactos para seed=%s', seed => {
    const expected = referenceStates(seed, 10002).map(state => (state + 0.5) / 4294967296);
    const next = createUniformRandom(seed);
    const actual = expected.map(() => next());
    expect(actual).toEqual(expected);
    expect(actual.every(value => Number.isFinite(value) && value > 0 && value < 1)).toBe(true);
  });

  it.each([
    [1, [4.3769336535918235, 0.8857907527263581, 0.49862037154200034, 1.5729326244478354, -0.5328000695239785, -0.5664929682318993]],
    [42, [-1.8404491679307617, 1.225908490637386, -0.264270457639072, -0.4934637154516984, 0.007571416694205442, 0.19485871935993282]],
    [0, [-1.5016346033114911, -0.7909175470327563, 0.14939937338812295, -0.3672655228271113, 0.21499911130804789, 0.015010862744044213]],
    [4294967295, [4.391719642067528, 1.1778716232480686, -1.0005838164258984, 1.2469778525696615, -0.6728608676644349, 0.3372882596479742]],
  ] as const)('usa dos uniformes por normal y descarta el seno para seed=%s', (seed, expectedNormals) => {
    const next = createGaussianRandom(seed);
    for (const expected of expectedNormals) {
      expect(Math.abs(next() - expected)).toBeLessThan(1e-12);
    }
  });

  it('mantiene uniformes y gaussianas de semilla cero equivalentes a la sustitución fijada', () => {
    const zeroUniform = createUniformRandom(0);
    const replacementUniform = createUniformRandom(1831565813);
    const zeroGaussian = createGaussianRandom(0);
    const replacementGaussian = createGaussianRandom(1831565813);
    for (let index = 0; index < 5001; index++) {
      expect(zeroUniform()).toBe(replacementUniform());
      expect(zeroGaussian()).toBe(replacementGaussian());
    }
  });

  it('separa el estado de cada generador y reinicia cada nueva instancia', () => {
    const first = createGaussianRandom(42);
    const second = createGaussianRandom(42);
    const unrelated = createGaussianRandom(1);
    const firstUniform = createUniformRandom(42);
    const secondUniform = createUniformRandom(42);
    for (let index = 0; index < 100; index++) {
      const expected = first();
      unrelated();
      unrelated();
      expect(second()).toBe(expected);
      expect(firstUniform()).toBe(secondUniform());
    }
    expect(Math.abs(createGaussianRandom(42)() + 1.8404491679307617)).toBeLessThan(1e-12);
    expect(createUniformRandom(42)()).toBe(0.00264389265794307);
  });

  it.each([0, 4294967295])('produce 5001 gaussianas finitas en las semillas límite %s', seed => {
    const next = createGaussianRandom(seed);
    const actual = Array.from({ length: 5001 }, () => next());
    expect(actual.every(Number.isFinite)).toBe(true);
  });
});
