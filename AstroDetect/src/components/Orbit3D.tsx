import { useEffect, useRef, useState } from 'react';
import { PHYSICAL_CONSTANTS } from '../contracts';
import type { Scenario } from '../contracts';
import { positionAt } from '../simulation';
import { semiMajorAxisMetres } from '../simulation/geometry';
import type { OrbitView } from './orbitScene';
import { MIN_VISUAL_PLANET_RATIO } from './orbitPresentation';
import { stellarColorFor } from './stellarProfiles';

type Status = 'loading' | 'ready' | 'lost' | 'unavailable' | 'load-error';

function orbitalAngle(scenario: Scenario, timeDays: number): number {
  const position = positionAt(scenario, timeDays);
  const semiMajorAxisOverStarRadius = semiMajorAxisMetres(scenario.periodDays, scenario.starMassSolar)
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
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const ratio = scenario.planetRadiusEarth * PHYSICAL_CONSTANTS.earthRadiusMetres
    / (scenario.starRadiusSolar * PHYSICAL_CONSTANTS.solarRadiusMetres);
  const angle = orbitalAngle(scenario, timeDays);
  const starColor = stellarColorFor(scenario);
  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    function contextLost() { setStatus('lost'); }
    function contextRestored() { setStatus('ready'); }
    canvas?.addEventListener('webglcontextlost', contextLost);
    canvas?.addEventListener('webglcontextrestored', contextRestored);
    import('./orbitScene').then(({ createOrbitView }) => {
      if (cancelled || !canvasRef.current || !containerRef.current) return;
      try {
        viewRef.current = createOrbitView(canvasRef.current, containerRef.current);
        setStatus('ready');
      } catch {
        setStatus('unavailable');
      }
    }, () => { if (!cancelled) setStatus('load-error'); });
    return () => {
      cancelled = true;
      canvas?.removeEventListener('webglcontextlost', contextLost);
      canvas?.removeEventListener('webglcontextrestored', contextRestored);
      viewRef.current?.dispose();
      viewRef.current = null;
    };
  }, [attempt]);

  useEffect(() => { viewRef.current?.setBodies(ratio, angle); }, [ratio, angle, status]);
  useEffect(() => { viewRef.current?.setStarColor(starColor); }, [starColor, status]);
  useEffect(() => { viewRef.current?.setReducedMotion(reducedMotion); }, [reducedMotion, status]);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { rootMargin: '160px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { viewRef.current?.setActive(active && visible && status === 'ready'); }, [active, visible, status]);

  return <figure className="orbit-3d">
    <div className="orbit-3d-stage" ref={containerRef} hidden={status === 'unavailable' || status === 'load-error'}>
      <canvas ref={canvasRef} role="img" aria-label="Esquema orbital en 3D: la estrella iluminando al planeta, que recorre su órbita al mismo tiempo que la vista del observador y la curva." />
    </div>
    {status === 'lost' && <p role="status">Se interrumpió temporalmente la vista 3D. Se reanudará cuando el navegador recupere el contexto gráfico. La vista del observador, la curva y el detector siguen disponibles.</p>}
    {status === 'loading' && <p role="status">Cargando la vista 3D…</p>}
    {status === 'load-error' && <div role="status"><p>No se pudo cargar el módulo de la vista 3D. Puede deberse a una interrupción de conexión o a una actualización de la página. La vista del observador y la curva siguen disponibles.</p><button type="button" onClick={() => window.location.reload()}>Recargar la página</button><p>Al recargar se restablece el experimento inicial.</p></div>}
    {status === 'unavailable' && <div role="status"><p>No se pudo iniciar la vista 3D (WebGL). La vista del observador y la curva siguen disponibles.</p><button type="button" onClick={() => { setStatus('loading'); setAttempt(previous => previous + 1); }}>Reintentar vista 3D</button></div>}
    {status !== 'unavailable' && status !== 'load-error' && <div className="camera-buttons" aria-label="Controles de cámara"><button type="button" disabled={status !== 'ready'} onClick={() => viewRef.current?.rotateCamera(-1)}>Girar a la izquierda</button><button type="button" disabled={status !== 'ready'} onClick={() => viewRef.current?.rotateCamera(1)}>Girar a la derecha</button><button type="button" disabled={status !== 'ready'} onClick={() => viewRef.current?.resetCamera()}>Centrar cámara</button></div>}
    <figcaption>Esquema 3D con distancia orbital comprimida. {ratio < MIN_VISUAL_PLANET_RATIO ? `Planeta ampliado ×${(MIN_VISUAL_PLANET_RATIO / ratio).toLocaleString('es-CL', { maximumFractionDigits: 1 })} para hacerlo visible.` : 'Proporción real entre los radios.'} Arrastra para girar, usa la rueda o dos dedos para acercarte. Los colores y el sombreado son ilustrativos.</figcaption>
  </figure>;
}
