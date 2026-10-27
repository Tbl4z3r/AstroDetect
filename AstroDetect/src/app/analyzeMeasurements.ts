import { detectTransits } from '../analysis';
import { DEFAULT_DETECTION_OPTIONS } from '../contracts';
import type { DetectionResult, LightSample } from '../contracts';

export function analyzeMeasurements(samples: readonly LightSample[]): DetectionResult {
  const observations = samples.map(({ timeDays, observedFlux }) => ({ timeDays, flux: observedFlux }));
  return detectTransits(observations, DEFAULT_DETECTION_OPTIONS);
}
