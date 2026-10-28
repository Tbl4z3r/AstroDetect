import { useEffect, useRef, useState } from 'react';
import { PHYSICAL_CONSTANTS } from '../contracts';
import type { Scenario } from '../contracts';
import { positionAt } from '../simulation';
import { semiMajorAxisMetres } from '../simulation/geometry';
import type { OrbitView } from './orbitScene';
import { MIN_VISUAL_PLANET_RATIO } from './orbitPresentation';

type Status = 'loading' | 'ready' | 'unavailable';

function orbitalAngle(scenario: Scenario, timeDays: number): number {
  const position = positionAt(scenario, timeDays);
  const semiMajorAxisOverStarRadius = semiMajorAxisMetres(scenario.periodDays)
    / (scenario.starRadiusSolar * PHYSICAL_CONSTANTS.solarRadiusMetres);
  const sine = Math.max(-1, Math.min(1, position.xOverStarRadius / semiMajorAxisOverStarRadius));
  const cosine = Math.sqrt(1 - sine * sine);
  return Math.atan2(sine, position.inFront ? cosine : -cosine);
}

export default function Orbit3D({ scenario, timeDays, reducedMotion, active = true }: { scenario: Scenario; timeDays: number; reducedMotion: boolean; active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<OrbitView | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [visible, setVisible] = useState(true);
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
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { rootMargin: '160px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { viewRef.current?.setActive(active && visible); }, [active, visible, status]);

  return <figure className="orbit-3d">
    <div className="orbit-3d-stage" ref={containerRef} hidden={status === 'unavailable'}>
      <canvas ref={canvasRef} role="img" aria-label="Esquema orbital en 3D: la estrella iluminando al planeta, que recorre su órbita al mismo tiempo que la vista del observador y la curva." />
    </div>
    {status === 'unavailable' && <p>Tu navegador no permite la vista 3D (WebGL). La vista del observador y la curva siguen disponibles.</p>}
    {status !== 'unavailable' && <div className="camera-buttons" aria-label="Controles de cámara"><button type="button" disabled={status !== 'ready'} onClick={() => viewRef.current?.rotateCamera(-1)}>Girar a la izquierda</button><button type="button" disabled={status !== 'ready'} onClick={() => viewRef.current?.rotateCamera(1)}>Girar a la derecha</button><button type="button" disabled={status !== 'ready'} onClick={() => viewRef.current?.resetCamera()}>Centrar cámara</button></div>}
    <figcaption>Esquema 3D con distancia orbital comprimida. {ratio < MIN_VISUAL_PLANET_RATIO ? `Planeta ampliado ×${(MIN_VISUAL_PLANET_RATIO / ratio).toLocaleString('es-CL', { maximumFractionDigits: 1 })} para hacerlo visible.` : 'Proporción real entre los radios.'} Arrastra para girar, usa la rueda o dos dedos para acercarte. Los colores y el sombreado son ilustrativos.</figcaption>
  </figure>;
}
