import { useState } from 'react';
import ScenarioControls from '../components/ScenarioControls';
import HelpPanel from '../components/HelpPanel';
import TransitAnimation from '../components/TransitAnimation';
import LightCurve from '../components/LightCurve';
import PlaybackControls from '../components/PlaybackControls';
import { DEFAULT_SCENARIO } from '../contracts';
import type { Scenario } from '../contracts';
import { simulate } from '../simulation';
import { usePlayback } from './usePlayback';
import '../styles/laboratory.css';

export default function App() {
  const [dataset, setDataset] = useState(() => ({ scenario: { ...DEFAULT_SCENARIO }, result: simulate(DEFAULT_SCENARIO) }));
  const [valid, setValid] = useState(true);
  const playback = usePlayback(dataset.result.durationDays);
  function changeScenario(scenario: Scenario | null) {
    playback.restart();
    setValid(scenario !== null);
    if (scenario) setDataset({ scenario, result: simulate(scenario) });
  }
  return <>
    <a className="skip-link" href="#configuracion">Ir a la configuración</a>
    <header><p>Simulación educativa</p><h1>AstroDetect</h1><p>Explora cómo los tamaños y el ruido influyen en la observación de un posible tránsito.</p></header>
    <main>
      <ScenarioControls onScenarioChange={changeScenario} />
      {!valid && <p role="alert">Corrige los campos indicados. La observación y la curva están suspendidas; no se generan datos con entradas inválidas.</p>}
      <section aria-labelledby="observacion"><h2 id="observacion">2. Observación</h2>
        {valid ? <>
          <TransitAnimation scenario={dataset.scenario} timeDays={playback.timeDays} />
          <PlaybackControls timeDays={playback.timeDays} durationDays={dataset.result.durationDays} cadenceDays={dataset.result.cadenceDays}
            playing={playback.isPlaying} reducedMotion={playback.reducedMotion} onPlay={playback.play} onPause={playback.pause} onRestart={playback.restart} onSeek={playback.seek} />
          <p>Semilla vigente: {dataset.scenario.seed}. La reproducción conserva esta misma serie.</p>
        </> : <p>Observación suspendida hasta corregir la configuración.</p>}
      </section>
      <section aria-labelledby="medicion"><h2 id="medicion">3. Medición</h2>
        {valid ? <LightCurve result={dataset.result} timeDays={playback.timeDays} /> : <p>Curva suspendida hasta corregir la configuración.</p>}
      </section>
      <section aria-labelledby="interpretacion"><h2 id="interpretacion">4. Interpretación</h2><p>La búsqueda de posibles tránsitos aún no está integrada. No hay resultados de detección.</p><p>Una señal compatible con un tránsito no confirma un planeta. La falta de detección no demuestra su ausencia.</p></section>
      <HelpPanel />
    </main>
  </>;
}
