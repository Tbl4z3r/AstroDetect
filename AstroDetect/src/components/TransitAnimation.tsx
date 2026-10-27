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
  const planet = <circle data-testid="planet" cx={x} cy={y} r={planetRadius} fill="#0a1026" stroke="#5cc8ff" strokeWidth="0.8" />;
  return <figure className="transit-figure">
    <svg viewBox="0 0 480 220" role="img" aria-labelledby="transit-title transit-description" data-time-days={timeDays} data-front={position.inFront}>
      <title id="transit-title">Vista del tránsito desde el observador</title>
      <desc id="transit-description">Estrella y planeta con la misma escala de radios. El planeta se oculta tras la estrella cuando pasa por detrás; puede salir del encuadre.</desc>
      <defs>
        <radialGradient id="transit-star" cx="42%" cy="38%" r="62%"><stop offset="0%" stopColor="#fff3c4" /><stop offset="55%" stopColor="#ffc857" /><stop offset="100%" stopColor="#f08a24" /></radialGradient>
        <radialGradient id="transit-glow" cx="50%" cy="50%" r="50%"><stop offset="60%" stopColor="#ffc857" stopOpacity="0.28" /><stop offset="100%" stopColor="#ffc857" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="480" height="220" fill="#060a1a" />
      {[[40, 30], [95, 170], [150, 52], [330, 40], [395, 150], [450, 70], [60, 120], [300, 195], [420, 205], [200, 18]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="#cfe6ff" opacity="0.7" />)}
      <circle cx="240" cy="110" r={radius * 1.45} fill="url(#transit-glow)" />
      {!position.inFront && planet}
      <circle data-testid="star" cx="240" cy="110" r={radius} fill="url(#transit-star)" stroke="#f08a24" strokeWidth="1" />
      {position.inFront && planet}
    </svg>
    <figcaption>Vista del observador; escalas visuales ajustadas al encuadre. La proporción entre los radios se conserva; no se comprime la distancia del planeta. No es una vista completa de la órbita.</figcaption>
    <p data-testid="position-summary">Planeta {position.inFront ? 'delante' : 'detrás'} de la estrella{outside ? ', fuera del encuadre' : ''}. Tiempo compartido: {timeDays.toFixed(4)} días.</p>
  </figure>;
}
