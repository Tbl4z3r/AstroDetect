import { useRef, useState } from 'react';
import ScenarioControls from '../components/ScenarioControls';
import TransitAnimation from '../components/TransitAnimation';
import LightCurve from '../components/LightCurve';
import PlaybackControls from '../components/PlaybackControls';
import DetectionPanel from '../components/DetectionPanel';
import Logo from '../components/Logo';
import Orbit3D from '../components/Orbit3D';
import ScienceGuide from '../components/ScienceGuide';
import LearningExperiments from '../components/LearningExperiments';
import ModelReference from '../components/ModelReference';
import { DEFAULT_SCENARIO } from '../contracts';
import type { DetectionResult, Scenario } from '../contracts';
import { simulate } from '../simulation';
import { usePlayback } from './usePlayback';
import { analyzeMeasurements } from './analyzeMeasurements';
import '../styles/laboratory.css';

type View = 'laboratory' | 'guide' | 'experiments';
const views: { id: View; label: string; detail: string }[] = [
  { id: 'laboratory', label: 'Observar', detail: 'Del sistema a la medición' },
  { id: 'guide', label: 'Entender', detail: 'De la luz a la evidencia' },
  { id: 'experiments', label: 'Experimentar', detail: 'Una pregunta a la vez' },
];

export default function App() {
  const [dataset, setDataset] = useState(() => ({ scenario: { ...DEFAULT_SCENARIO }, result: simulate(DEFAULT_SCENARIO) }));
  const [controls, setControls] = useState({ initial: { ...DEFAULT_SCENARIO }, revision: 0 });
  const [valid, setValid] = useState(true);
  const [view, setView] = useState<View>('laboratory');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const laboratory = useRef<HTMLDivElement>(null);
  const guide = useRef<HTMLDivElement>(null);
  const experiments = useRef<HTMLDivElement>(null);
  const playback = usePlayback(dataset.result.durationDays);

  function changeView(next: View, focus = false) {
    playback.pause();
    setView(next);
    if (focus) requestAnimationFrame(() => ({ laboratory, guide, experiments })[next].current?.focus());
  }
  function changeScenario(scenario: Scenario | null) {
    playback.restart();
    setDetection(null);
    setAnalysisError(null);
    setValid(scenario !== null);
    if (scenario) setDataset({ scenario, result: simulate(scenario) });
  }
  function loadExperiment(scenario: Scenario) {
    changeScenario(scenario);
    setControls(previous => ({ initial: { ...scenario }, revision: previous.revision + 1 }));
    setSettingsOpen(false);
    changeView('laboratory', true);
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
    <a className="skip-link" href="#configuracion" onClick={event => {
      event.preventDefault();
      changeView('laboratory');
      setSettingsOpen(true);
      requestAnimationFrame(() => document.getElementById('configuracion')?.focus());
    }}>Ir a la configuración</a>
    <header className="site-header">
      <div className="brand"><Logo size={42} /><div><p className="eyebrow">Cuaderno orbital</p><h1>AstroDetect</h1></div></div>
      <p className="educational-label">Simulación educativa <span>Una estrella · un planeta</span></p>
    </header>
    <main>
      <div className="introduction"><p className="eyebrow">La luz guarda una pista</p><h2>Del movimiento a la evidencia.</h2><p>Un planeta cruza una estrella. Su brillo cambia. ¿Qué puedes inferir de esa pequeña sombra?</p></div>
      <nav className="workspace-navigation" aria-label="Vistas del cuaderno">
        {views.map((item, index) => <button type="button" key={item.id} aria-pressed={view === item.id} aria-controls={`view-${item.id}`} onClick={() => changeView(item.id)}>
          <span className="navigation-index" aria-hidden="true">0{index + 1}</span><span>{item.label}<small>{item.detail}</small></span>
        </button>)}
      </nav>
      <div id="view-laboratory" hidden={view !== 'laboratory'} ref={laboratory} tabIndex={-1} className="laboratory-layout">
        <button type="button" className="settings-toggle secondary-button" aria-expanded={settingsOpen} aria-controls="scenario-panel" onClick={() => setSettingsOpen(!settingsOpen)}>{settingsOpen ? 'Cerrar parámetros' : 'Ajustar sistema'}<span aria-hidden="true">{settingsOpen ? '−' : '+'}</span></button>
        <aside id="scenario-panel" className="scenario-panel" data-open={settingsOpen} aria-label="Parámetros y referencia del modelo">
          <ScenarioControls key={controls.revision} initialScenario={controls.initial} onScenarioChange={changeScenario} />
          {valid && <ModelReference scenario={dataset.scenario} result={dataset.result} />}
        </aside>
        <div className="laboratory-work">
          {!valid && <p role="alert" className="configuration-alert">Corrige los campos indicados. La observación y la curva están suspendidas; no se generan datos con entradas inválidas.</p>}
          <section aria-labelledby="observacion" className="observation-section"><div className="section-heading"><div><p className="section-index">Geometría</p><h2 id="observacion">Una órbita, dos miradas</h2></div><span className="section-caption">Mismo sistema · mismo tiempo</span></div>
            {valid ? <>
              <div className="observation-views"><div className="orbital-view"><h3>Perspectiva libre</h3><Orbit3D scenario={dataset.scenario} timeDays={playback.timeDays} reducedMotion={playback.reducedMotion} active={view === 'laboratory'} /></div>
                <div className="observer-view"><h3>Observador de la curva</h3><TransitAnimation scenario={dataset.scenario} timeDays={playback.timeDays} /></div></div>
              <p className="camera-explanation">Girar la cámara cambia el esquema que exploras. La línea de visión de la medición permanece fija.</p>
              <PlaybackControls timeDays={playback.timeDays} durationDays={dataset.result.durationDays} cadenceDays={dataset.result.cadenceDays}
                playing={playback.isPlaying} reducedMotion={playback.reducedMotion} onPlay={playback.play} onPause={playback.pause} onRestart={playback.restart} onSeek={playback.seek}
                onTransit={() => playback.seek(dataset.scenario.periodDays / 2)} />
            </> : <p>Observación suspendida hasta corregir la configuración.</p>}
          </section>
          <section aria-labelledby="medicion" className="measurement-section"><div className="section-heading"><div><p className="section-index">Medición</p><h2 id="medicion">La huella en la luz</h2></div><button type="button" className="text-button" onClick={() => changeView('guide', true)}>¿Qué significa flujo normalizado?</button></div>
            {valid ? <LightCurve result={dataset.result} timeDays={playback.timeDays} /> : <p>Curva suspendida hasta corregir la configuración.</p>}
          </section>
          <DetectionPanel result={detection} error={analysisError} disabled={!valid} onDetect={analyze} />
        </div>
      </div>
      <div id="view-guide" hidden={view !== 'guide'} ref={guide} tabIndex={-1}><ScienceGuide onExperiment={loadExperiment} /></div>
      <div id="view-experiments" hidden={view !== 'experiments'} ref={experiments} tabIndex={-1}><LearningExperiments onExperiment={loadExperiment} /></div>
    </main>
    <footer className="site-footer"><span>Datos simulados. Preguntas reales.</span><a href="https://github.com/Tbl4z3r/AstroDetect">Modelo, equipo y código del proyecto ↗</a></footer>
  </>;
}
