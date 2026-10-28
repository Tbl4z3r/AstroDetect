import { useEffect, useMemo, useRef, useState } from 'react';
import type { SimulationResult } from '../contracts';

const left = 74;
const top = 20;
const bottom = 208;

export default function LightCurve({ result, timeDays }: { result: SimulationResult; timeDays: number }) {
  const figureRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(640);
  const right = width - 18;
  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(120, entries[0].contentRect.width)));
    observer.observe(figure);
    return () => observer.disconnect();
  }, []);
  const plot = useMemo(() => {
    let min = 1;
    let max = 1;
    for (const sample of result.samples) {
      min = Math.min(min, sample.cleanFlux, sample.observedFlux);
      max = Math.max(max, sample.cleanFlux, sample.observedFlux);
    }
    const padding = Math.max((max - min) * 0.08, 0.000001);
    min -= padding;
    max += padding;
    const x = (time: number) => left + time / result.durationDays * (right - left);
    const y = (flux: number) => bottom - (flux - min) / (max - min) * (bottom - top);
    const path = (field: 'cleanFlux' | 'observedFlux') => result.samples.map((sample, index) =>
      `${index === 0 ? 'M' : 'L'}${x(sample.timeDays).toFixed(3)},${y(sample[field]).toFixed(3)}`).join(' ');
    return { min, max, clean: path('cleanFlux'), observed: path('observedFlux') };
  }, [result, right]);
  const ticks = width < 400 ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1];
  return <figure className="light-curve" ref={figureRef}>
    <p className="axis-label">Flujo normalizado (sin unidad)</p>
    <svg viewBox={`0 0 ${width} 260`} role="img" aria-labelledby="curve-title curve-description" data-time-days={timeDays}>
      <title id="curve-title">Curva de brillo simulada</title>
      <desc id="curve-description">Curvas limpia y observada completas, con cursor del mismo tiempo que la vista del tránsito. El eje vertical se ajusta a todos los valores, sin recortarlos.</desc>
      {[0, 0.5, 1].map(fraction => <g key={fraction}>
        <line x1={left} x2={right} y1={bottom - fraction * (bottom - top)} y2={bottom - fraction * (bottom - top)} className="grid-line" />
        <text x={left - 10} y={bottom - fraction * (bottom - top) + 7} textAnchor="end">{(plot.min + fraction * (plot.max - plot.min)).toFixed(5)}</text>
      </g>)}
      {ticks.map(fraction => <g key={fraction}>
        <line x1={left + fraction * (right - left)} x2={left + fraction * (right - left)} y1={bottom} y2={bottom + 7} className="axis-line" />
        <text x={left + fraction * (right - left)} y={bottom + 35} textAnchor={fraction === 0 ? 'start' : fraction === 1 ? 'end' : 'middle'}>{(fraction * result.durationDays).toLocaleString('es-CL', { maximumFractionDigits: 2 })}</text>
      </g>)}
      <path d={`M${left},${top} V${bottom} H${right}`} className="axis-line" />
      <path data-testid="observed-curve" d={plot.observed} className="observed-line" />
      <path data-testid="clean-curve" d={plot.clean} className="clean-line" />
      <line data-testid="time-cursor" x1={left + timeDays / result.durationDays * (right - left)} x2={left + timeDays / result.durationDays * (right - left)} y1={top} y2={bottom} className="cursor-line" />
    </svg>
    <p className="axis-label">Tiempo (días)</p>
    <figcaption>
      <p className="curve-legend"><span><i className="observed-key" />Medición simulada con ruido — línea azul continua</span><span><i className="clean-key" />Flujo limpio — línea naranja discontinua</span><span><i className="cursor-key" />Tiempo compartido — línea violeta vertical</span></p>
      <p data-testid="series-summary">{result.samples.length} muestras completas entre 0 y {result.durationDays} días. Cadencia: {result.cadenceDays} días. Escala vertical ampliada automáticamente: {plot.min.toFixed(6)} a {plot.max.toFixed(6)}; ninguna medición se recorta, incluso si supera 1.</p>
      <p>La ventana y la cadencia dependen del período configurado; es una simplificación didáctica, no una inferencia del detector.</p>
    </figcaption>
  </figure>;
}
