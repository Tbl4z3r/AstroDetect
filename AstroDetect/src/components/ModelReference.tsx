import type { Scenario, SimulationResult } from '../contracts';
import { DEFAULT_DETECTION_OPTIONS } from '../contracts';
import { experimentQuantities, formatExperimentNumber as number, formatExperimentOperand as operand } from './experimentMath';
import { stellarProfileFor } from './stellarProfiles';

export default function ModelReference({ scenario, result }: { scenario: Scenario; result: SimulationResult }) {
  const values = experimentQuantities(scenario, result);
  const profile = stellarProfileFor(scenario);
  return <div className="model-reference" data-guide="model">
    <p className="section-index">Referencia del modelo</p><p>Estos valores describen el escenario, no son resultados del detector.</p>
    <dl><div><dt>Estrella del experimento</dt><dd>{profile ? profile.name : 'Configuración libre'}</dd></div>
      <div><dt>Masa estelar del modelo</dt><dd>{operand(values.starMassSolar)} M☉</dd></div>
      <div><dt>Caída central ideal</dt><dd>{number(values.depth * 1e6, 2)} ppm</dd></div>
      <div><dt>Duración física del tránsito</dt><dd>{number(values.durationDays * 24, 3)} horas</dd></div>
      <div><dt>Ventana de observación</dt><dd>{number(result.durationDays)} días</dd></div>
      <div><dt>Distancia orbital</dt><dd>{number(values.orbitMetres / 1e9, 2)} millones de km</dd></div></dl>
    <p>Órbita circular. Inclinación de 90°. El selector propone modelos educativos de secuencia principal; no reproduce una estrella observada.</p>
    {!profile && <p>La masa y el radio se exploran independientemente. Esta combinación no valida una estrella real ni una etapa de evolución.</p>}
    {values.durationDays < DEFAULT_DETECTION_OPTIONS.minSamples * result.cadenceDays && <p role="status" className="concept-note">Resolución temporal limitada: el tránsito dura menos de {DEFAULT_DETECTION_OPTIONS.minSamples} cadencias. Puede no haber suficientes muestras bajo el umbral del detector; una no detección no demuestra ausencia del planeta.</p>}
  </div>;
}
