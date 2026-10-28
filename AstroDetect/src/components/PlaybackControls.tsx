interface Props {
  timeDays: number;
  durationDays: number;
  cadenceDays: number;
  playing: boolean;
  reducedMotion: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onSeek: (timeDays: number) => void;
  onTransit?: () => void;
}

export default function PlaybackControls(props: Props) {
  return <div className="playback-controls">
    <div className="playback-buttons">
      <button type="button" onClick={props.playing ? props.onPause : props.onPlay} disabled={props.reducedMotion}>{props.playing ? 'Pausar' : 'Reproducir'}</button>
      <button type="button" onClick={props.onRestart}>Volver al inicio</button>
      <button type="button" onClick={() => props.onSeek(props.timeDays + props.cadenceDays)} disabled={props.timeDays >= props.durationDays}>Avanzar una muestra</button>
      {props.onTransit && <button type="button" onClick={props.onTransit}>Ir al primer tránsito</button>}
    </div>
    <p>Velocidad de visualización: recorrido completo en 30 segundos; no modifica el período orbital.</p>
    {props.reducedMotion && <p>Movimiento reducido activo: reproducción continua desactivada. Usa el control de tiempo o avanza una muestra con el teclado.</p>}
    <label htmlFor="simulation-time">Tiempo simulado (días)</label>
    <input id="simulation-time" type="range" min="0" max={props.durationDays} step={props.cadenceDays} value={props.timeDays}
      aria-valuetext={`${props.timeDays.toFixed(4)} días de ${props.durationDays} días`}
      onChange={event => props.onSeek(Number(event.target.value))} />
    <output htmlFor="simulation-time" aria-live="off" data-testid="clock">{props.timeDays.toFixed(4)} / {props.durationDays} días</output>
    <p>{props.playing ? 'Reproduciendo' : 'En pausa'}. Mover el tiempo o volver al inicio conserva los datos y la semilla.</p>
  </div>;
}
