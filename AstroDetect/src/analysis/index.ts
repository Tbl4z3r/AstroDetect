import { validateDetectionOptions } from '../contracts';
import type { DetectionOptions, DetectionResult, Observation, TransitCandidate } from '../contracts';

function finite(value: number): number {
  if (!Number.isFinite(value)) throw new Error('El cálculo excede el rango numérico finito.');
  return value;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : sorted[middle - 1] / 2 + sorted[middle] / 2;
}

function differences(values: number[]): number[] {
  return values.slice(1).map((value, index) => finite(value - values[index]));
}

export function detectTransits(observations: Observation[], options: DetectionOptions): DetectionResult {
  const validation = validateDetectionOptions(options);
  if (!validation.valid) throw new Error(validation.errors.map(error => `${error.field}: ${error.message}`).join(' '));
  for (let index = 0; index < observations.length; index++) {
    const sample = observations[index];
    if (!Number.isFinite(sample.timeDays) || !Number.isFinite(sample.flux))
      throw new Error(`Muestra ${index}: tiempo y flujo deben ser finitos.`);
    if (index > 0 && sample.timeDays <= observations[index - 1].timeDays)
      throw new Error('Los tiempos deben ser estrictamente crecientes.');
  }
  if (observations.length < Math.max(7, options.minSamples))
    return { status: 'insufficient-data', events: [], estimatedPeriodDays: null, warnings: ['No hay suficientes muestras para analizar la serie.'] };

  const baseline = median(observations.map(sample => sample.flux));
  if (baseline <= 0) throw new Error('La línea base debe ser positiva.');
  const mad = median(observations.map(sample => finite(Math.abs(sample.flux - baseline))));
  const scale = Math.max(finite(1.4826 * mad), options.noiseFloor);
  const threshold = finite(baseline - finite(options.thresholdSigma * scale));
  const cadences = differences(observations.map(sample => sample.timeDays));
  const cadence = median(cadences);
  const warnings: string[] = [];
  if (cadences.some(value => Math.abs(value - cadence) > 0.1 * cadence))
    warnings.push('La cadencia varía más de 10%; la estimación de repetición es orientativa.');

  const events: TransitCandidate[] = [];
  let start = 0;
  while (start < observations.length) {
    if (observations[start].flux >= threshold) {
      start++;
      continue;
    }
    let end = start + 1;
    while (end < observations.length && observations[end].flux < threshold) end++;
    if (end - start >= options.minSamples) {
      const startDays = observations[start].timeDays;
      const endDays = observations[end - 1].timeDays;
      events.push({ startDays, endDays, centerDays: startDays / 2 + endDays / 2,
        depth: finite(baseline - median(observations.slice(start, end).map(sample => sample.flux))), sampleCount: end - start });
    }
    start = end;
  }

  let estimatedPeriodDays: number | null = null;
  if (events.length < options.minEventsForPeriod) {
    warnings.push('No hay suficientes eventos para estimar repetición.');
  } else {
    const intervals = differences(events.map(event => event.centerDays));
    const period = median(intervals);
    const tolerance = Math.max(finite(2 * cadence), finite(options.periodToleranceFraction * period));
    if (period > 2 * cadence && intervals.every(value => Math.abs(value - period) <= tolerance))
      estimatedPeriodDays = period;
    else warnings.push('Repetición inconsistente; no se estima un período.');
  }
  if (events.length) warnings.push('Una señal candidata no confirma un planeta.');
  return { status: events.length ? 'candidate' : 'no-evidence', events, estimatedPeriodDays, warnings };
}
