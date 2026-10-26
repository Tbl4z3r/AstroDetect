import ScenarioControls from '../components/ScenarioControls';
import HelpPanel from '../components/HelpPanel';
import '../styles/laboratory.css';

export default function App() {
  return <>
    <a className="skip-link" href="#configuracion">Ir a la configuración</a>
    <header><p>Simulación educativa</p><h1>AstroDetect</h1><p>Explora cómo los tamaños y el ruido influyen en la observación de un posible tránsito.</p></header>
    <main>
      <ScenarioControls />
      <section aria-labelledby="observacion"><h2 id="observacion">2. Observación</h2><p>Pendiente de implementación: animación de la estrella y el planeta. Aún no hay reproducción disponible.</p></section>
      <section aria-labelledby="medicion"><h2 id="medicion">3. Medición</h2><p>Pendiente de implementación: curva de luz. Todavía no se generan datos simulados.</p></section>
      <section aria-labelledby="interpretacion"><h2 id="interpretacion">4. Interpretación</h2><p>La búsqueda de posibles tránsitos aún no está integrada. No hay resultados de detección.</p><p>Una señal compatible con un tránsito no confirma un planeta. La falta de detección no demuestra su ausencia.</p></section>
      <HelpPanel />
    </main>
  </>;
}
