import { expect, test } from 'vitest';
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { DEFAULT_SCENARIO, DEFAULT_DETECTION_OPTIONS } from '../../../src/contracts';
import { simulate } from '../../../src/simulation';
import { detectTransits } from '../../../src/analysis';

test('registra tiempos de generación y detección para 5001 mediciones', () => {
  const cases = [
    { name: 'predeterminado', scenario: { ...DEFAULT_SCENARIO } },
    { name: 'señal clara', scenario: { ...DEFAULT_SCENARIO, planetRadiusEarth: 20 } },
    { name: 'señal débil', scenario: { ...DEFAULT_SCENARIO, starRadiusSolar: 2, planetRadiusEarth: 1, noisePpm: 5000 } },
  ];
  const summary = [];
  const curves = [];
  for (const item of cases) {
    const series = simulate(item.scenario);
    const observations = series.samples.map(sample => ({ timeDays: sample.timeDays, flux: sample.observedFlux }));
    expect(observations).toHaveLength(5001);
    for (let i = 0; i < 5; i++) {
      simulate(item.scenario);
      detectTransits(observations, DEFAULT_DETECTION_OPTIONS);
    }
    const generation = [];
    const detection = [];
    for (let i = 0; i < 50; i++) {
      let start = performance.now();
      simulate(item.scenario);
      generation.push(performance.now() - start);
      start = performance.now();
      detectTransits(observations, DEFAULT_DETECTION_OPTIONS);
      detection.push(performance.now() - start);
    }
    const stats = (values: number[]) => {
      const sorted = [...values].sort((a, b) => a - b);
      return { minMs: sorted[0], medianMs: sorted[25], p95Ms: sorted[47], maxMs: sorted[49] };
    };
    const result = detectTransits(observations, DEFAULT_DETECTION_OPTIONS);
    summary.push({ name: item.name, scenario: item.scenario, sampleCount: observations.length,
      generation: stats(generation), detection: stats(detection), events: result.events.length,
      periodDays: result.estimatedPeriodDays, status: result.status });
    curves.push({ name: item.name, scenario: item.scenario, samples: series.samples, result });
    expect(generation.every(Number.isFinite)).toBe(true);
    expect(detection.every(Number.isFinite)).toBe(true);
  }
  fs.mkdirSync('agents/evidence/T402', { recursive: true });
  fs.mkdirSync('../../informe-preparacion', { recursive: true });
  fs.writeFileSync('agents/evidence/T402/performance.json', JSON.stringify({
    sampleCount: 5001, iterationsPerCase: 50, warmupPerCase: 5, runtime: process.version,
    platform: process.platform, architecture: process.arch, units: 'milliseconds',
    measuredScope: 'synchronous pure functions; excludes rendering and network',
    targetMs: 200, targetMetOnEveryRecordedCall: summary.every(s => s.generation.maxMs < 200 && s.detection.maxMs < 200), cases: summary,
  }, null, 2) + '\n');
  fs.writeFileSync('../../informe-preparacion/curvas-finales.json', JSON.stringify(curves));
});
