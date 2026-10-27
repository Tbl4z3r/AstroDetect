import { useState } from 'react';
import ScenarioControls from '../components/ScenarioControls';
import HelpPanel from '../components/HelpPanel';
import TransitAnimation from '../components/TransitAnimation';
import LightCurve from '../components/LightCurve';
import PlaybackControls from '../components/PlaybackControls';
import DetectionPanel from '../components/DetectionPanel';
import { DEFAULT_SCENARIO } from '../contracts';
import type { DetectionResult, Scenario } from '../contracts';
import { simulate } from '../simulation';
import { usePlayback } from './usePlayback';
import { analyzeMeasurements } from './analyzeMeasurements';
import '../styles/laboratory.css';

export default function App() {
  const [dataset, setDataset] = useState(() => ({ scenario: { ...DEFAULT_SCENARIO }, result: simulate(DEFAULT_SCENARIO) }));
  const [valid, setValid] = useState(true);
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const playback = usePlayback(dataset.result.durationDays);
  function changeScenario(scenario: Scenario | null) {
    playback.restart();
    setDetection(null);
    setAnalysisError(null);
    setValid(scenario !== null);
    if (scenario) setDataset({ scenario, result: simulate(scenario) });
  }
  function analyze() {
    if (!valid) return;
    setAnalysisError(null);
    setDetection(null);
    try {
      setDetection(analyzeMeasurements(dataset.result.samples));
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Intenta regenerar los datos con una configuración válida.');
    }
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
      <DetectionPanel result={detection} error={analysisError} disabled={!valid} onDetect={analyze} />
      <HelpPanel />
    </main>
  </>;
}
