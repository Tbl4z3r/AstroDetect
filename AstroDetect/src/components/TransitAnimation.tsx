import { PHYSICAL_CONSTANTS } from '../contracts';
import type { Scenario } from '../contracts';
import { positionAt } from '../simulation';

export default function TransitAnimation({ scenario, timeDays }: { scenario: Scenario; timeDays: number }) {
  const position = positionAt(scenario, timeDays);
  const radius = 72;
  const planetRadius = radius * scenario.planetRadiusEarth * PHYSICAL_CONSTANTS.earthRadiusMetres
    / (scenario.starRadiusSolar * PHYSICAL_CONSTANTS.solarRadiusMetres);
  const x = 240 + position.xOverStarRadius * radius;
  const y = 110 - position.yOverStarRadius * radius;
  const outside = x + planetRadius < 0 || x - planetRadius > 480;
  const planet = <circle data-testid="planet" cx={x} cy={y} r={planetRadius} fill="#192f50" stroke="#fff" strokeWidth="0.5" />;
  return <figure className="transit-figure">
    <svg viewBox="0 0 480 220" role="img" aria-labelledby="transit-title transit-description" data-time-days={timeDays} data-front={position.inFront}>
      <title id="transit-title">Vista del tránsito desde el observador</title>
      <desc id="transit-description">Estrella y planeta con la misma escala de radios. El planeta se oculta tras la estrella cuando pasa por detrás; puede salir del encuadre.</desc>
      <rect width="480" height="220" fill="#e5edf6" />
      {!position.inFront && planet}
      <circle data-testid="star" cx="240" cy="110" r={radius} fill="#f6bc48" stroke="#735400" strokeWidth="1" />
      {position.inFront && planet}
    </svg>
    <figcaption>Vista del observador; escalas visuales ajustadas al encuadre. La proporción entre los radios se conserva; no se comprime la distancia del planeta. No es una vista completa de la órbita.</figcaption>
    <p data-testid="position-summary">Planeta {position.inFront ? 'delante' : 'detrás'} de la estrella{outside ? ', fuera del encuadre' : ''}. Tiempo compartido: {timeDays.toFixed(4)} días.</p>
  </figure>;
}
