import type { Scenario, SimulationResult } from '../contracts';
import { semiMajorAxisMetres } from '../simulation/geometry';

export default function ModelReference({ scenario, result }: { scenario: Scenario; result: SimulationResult }) {
  const minimumFlux = result.samples.reduce((minimum, sample) => Math.min(minimum, sample.cleanFlux), 1);
  const number = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 });
  return <div className="model-reference">
    <p className="section-index">Referencia del modelo</p><p>Estos valores describen el escenario, no son resultados del detector.</p>
    <dl><div><dt>Caída central ideal</dt><dd>{number.format((1 - minimumFlux) * 1e6)} ppm</dd></div>
      <div><dt>Ventana de observación</dt><dd>{number.format(result.durationDays)} días</dd></div>
      <div><dt>Distancia orbital</dt><dd>{number.format(semiMajorAxisMetres(scenario.periodDays) / 1e9)} millones de km</dd></div></dl>
    <p>Una masa solar fija. Órbita circular. Inclinación de 90°.</p>
  </div>;
}
