import { NOISE_CONVENTION } from '../contracts';

export function createUniformRandom(seed: number): () => number {
  let state = seed === 0 ? NOISE_CONVENTION.zeroSeedState : seed;
  return () => {
    state = (state ^ (state << NOISE_CONVENTION.shifts[0])) >>> 0;
    state = (state ^ (state >>> NOISE_CONVENTION.shifts[1])) >>> 0;
    state = (state ^ (state << NOISE_CONVENTION.shifts[2])) >>> 0;
    return (state + NOISE_CONVENTION.uniformOffset) / NOISE_CONVENTION.uniformDivisor;
  };
}

export function createGaussianRandom(seed: number): () => number {
  const nextUniform = createUniformRandom(seed);
  return () => {
    const first = nextUniform();
    const second = nextUniform();
    return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
  };
}
