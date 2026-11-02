import type { Scenario } from '../contracts';

export interface StellarProfile {
  id: string;
  name: string;
  spectralType: string;
  massSolar: number;
  radiusSolar: number;
  color: string;
  description: string;
}

export const STAR_PROFILES: readonly StellarProfile[] = [
  { id: 'red-dwarf', name: 'Enana roja', spectralType: 'M', massSolar: 0.3, radiusSolar: 0.3, color: '#ff9066', description: 'Pequeña y más fría que el Sol. El mismo planeta cubre una fracción mayor de su disco.' },
  { id: 'orange-dwarf', name: 'Enana naranja', spectralType: 'K', massSolar: 0.7, radiusSolar: 0.7, color: '#ffb875', description: 'Un modelo intermedio entre una enana roja y una estrella similar al Sol.' },
  { id: 'sunlike', name: 'Similar al Sol', spectralType: 'G', massSolar: 1, radiusSolar: 1, color: '#ffd27a', description: 'La referencia solar: una masa solar y un radio solar.' },
  { id: 'hot-star', name: 'Más caliente', spectralType: 'F', massSolar: 1.3, radiusSolar: 1.4, color: '#fff1dc', description: 'Más grande y masiva que el Sol. El mismo planeta produce una caída relativa menor.' },
];

export function stellarProfileFor(scenario: Pick<Scenario, 'starRadiusSolar' | 'starMassSolar'>): StellarProfile | undefined {
  return STAR_PROFILES.find(profile => profile.radiusSolar === scenario.starRadiusSolar && profile.massSolar === (scenario.starMassSolar ?? 1));
}

export function stellarColorFor(scenario: Pick<Scenario, 'starRadiusSolar' | 'starMassSolar'>): string {
  return stellarProfileFor(scenario)?.color ?? '#ddd9e6';
}
