import type { Scenario, SimulationResult } from '../contracts';
import { experimentQuantities, formatExperimentNumber as number } from './experimentMath';

export default function ModelReference({ scenario, result }: { scenario: Scenario; result: SimulationResult }) {
  const values = experimentQuantities(scenario, result);
  return <div className="model-reference" data-guide="model">
    <p className="section-index">Referencia del modelo</p><p>Estos valores describen el escenario, no son resultados del detector.</p>
    <dl><div><dt>Masa estelar del modelo</dt><dd>1 M☉ <span>(fija)</span></dd></div>
      <div><dt>Caída central ideal</dt><dd>{number(values.depth * 1e6, 2)} ppm</dd></div>
      <div><dt>Duración física del tránsito</dt><dd>{number(values.durationDays * 24, 3)} horas</dd></div>
      <div><dt>Ventana de observación</dt><dd>{number(result.durationDays)} días</dd></div>
      <div><dt>Distancia orbital</dt><dd>{number(values.orbitMetres / 1e9, 2)} millones de km</dd></div></dl>
    <p>Una masa solar fija. Órbita circular. Inclinación de 90°.</p>
  </div>;
}
