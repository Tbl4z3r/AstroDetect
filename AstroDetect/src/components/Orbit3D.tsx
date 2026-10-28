import { useEffect, useRef, useState } from 'react';
import { PHYSICAL_CONSTANTS } from '../contracts';
import type { Scenario } from '../contracts';
import { positionAt } from '../simulation';
import { semiMajorAxisMetres } from '../simulation/geometry';
import type { OrbitView } from './orbitScene';

type Status = 'loading' | 'ready' | 'unavailable';

function orbitalAngle(scenario: Scenario, timeDays: number): number {
  const position = positionAt(scenario, timeDays);
  const semiMajorAxisOverStarRadius = semiMajorAxisMetres(scenario.periodDays)
    / (scenario.starRadiusSolar * PHYSICAL_CONSTANTS.solarRadiusMetres);
  const sine = Math.max(-1, Math.min(1, position.xOverStarRadius / semiMajorAxisOverStarRadius));
  const cosine = Math.sqrt(1 - sine * sine);
  return Math.atan2(sine, position.inFront ? cosine : -cosine);
}

export default function Orbit3D({ scenario, timeDays, reducedMotion }: { scenario: Scenario; timeDays: number; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<OrbitView | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const ratio = scenario.planetRadiusEarth * PHYSICAL_CONSTANTS.earthRadiusMetres
    / (scenario.starRadiusSolar * PHYSICAL_CONSTANTS.solarRadiusMetres);
  const angle = orbitalAngle(scenario, timeDays);
  useEffect(() => {
    let cancelled = false;
    import('./orbitScene').then(({ createOrbitView }) => {
      if (cancelled || !canvasRef.current || !containerRef.current) return;
      try {
        viewRef.current = createOrbitView(canvasRef.current, containerRef.current);
        setStatus('ready');
      } catch {
        setStatus('unavailable');
      }
    }, () => { if (!cancelled) setStatus('unavailable'); });
    return () => {
      cancelled = true;
      viewRef.current?.dispose();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => { viewRef.current?.setBodies(ratio, angle); }, [ratio, angle, status]);
  useEffect(() => { viewRef.current?.setReducedMotion(reducedMotion); }, [reducedMotion, status]);

  return <figure className="orbit-3d">
    <div className="orbit-3d-stage" ref={containerRef} hidden={status === 'unavailable'}>
      <canvas ref={canvasRef} role="img" aria-label="Esquema orbital en 3D: la estrella iluminando al planeta, que recorre su órbita al mismo tiempo que la vista del observador y la curva." />
    </div>
    {status === 'unavailable' && <p>Tu navegador no permite la vista 3D (WebGL). La vista del observador y la curva siguen disponibles.</p>}
    <figcaption>Vista orbital en 3D; esquema con la distancia orbital comprimida y la proporción real entre los radios. Arrastra para girar la cámara, usa la rueda o dos dedos para acercarte y haz doble clic para volver a la vista inicial, que mira desde el lado del observador.</figcaption>
  </figure>;
}
