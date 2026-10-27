import type { DetectionResult } from '../contracts';

const time = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 5 });
const depth = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 6, maximumFractionDigits: 6 });
const ppm = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 });

const statusLabels: Record<DetectionResult['status'], string> = {
  candidate: 'Señal compatible con un posible tránsito',
  'no-evidence': 'Sin evidencia con los criterios actuales',
  'insufficient-data': 'Datos insuficientes para el análisis',
};

interface DetectionPanelProps {
  result: DetectionResult | null;
  error: string | null;
  disabled: boolean;
  onDetect: () => void;
}

export default function DetectionPanel({ result, error, disabled, onDetect }: DetectionPanelProps) {
  return <section aria-labelledby="interpretacion">
    <h2 id="interpretacion">4. Interpretación</h2>
    <p>Busca disminuciones de brillo y comprueba si se repiten. El algoritmo analiza únicamente los tiempos y el flujo medido, sin consultar los parámetros del escenario ni la curva ideal.</p>
    <button type="button" onClick={onDetect} disabled={disabled} aria-describedby="detection-help">Buscar posibles tránsitos</button>
    <p id="detection-help">{disabled ? 'Corrige la configuración para habilitar el análisis.' : 'La búsqueda conserva las mediciones, el tiempo y el estado de reproducción.'}</p>
    {error && <p className="field-error" role="alert">No se pudo analizar la serie. {error}</p>}
    {!result && !error && <p>No hay resultados de detección para esta configuración. Ejecuta la búsqueda cuando las entradas sean válidas.</p>}
    {result && <div className="detection-results" data-testid="detection-results">
      <p className="detection-status" role="status">{statusLabels[result.status]}. Eventos identificados: {result.events.length}.</p>
      {result.status === 'no-evidence' && <p>La señal puede ser demasiado débil o quedar oculta por el ruido. No identificar candidatos no demuestra la ausencia de un planeta.</p>}
      {result.status === 'insufficient-data' && <p>No hay suficientes mediciones para aplicar los criterios mínimos. Este estado no permite concluir si existe un tránsito.</p>}
      <h3>Repetición de los eventos</h3>
      {result.estimatedPeriodDays === null
        ? <p>No se pudo estimar un período: faltan eventos suficientes o sus separaciones no son consistentes con los criterios del algoritmo.</p>
        : <p>Período estimado: <strong>{time.format(result.estimatedPeriodDays)} días</strong>. Es una estimación a partir de las separaciones entre candidatos.</p>}
      {result.events.length > 0 && <>
        <h3>Posibles tránsitos</h3>
        <p>La duración corresponde al tramo de mediciones bajo el umbral de búsqueda; puede ser menor que la duración física completa del tránsito. La profundidad se mide respecto de la línea base estimada.</p>
        <ol className="detection-events" aria-label="Eventos candidatos">{result.events.map((event, index) => <li key={index}>
          <h4>Evento {index + 1}</h4>
          <dl>
            <div><dt>Centro</dt><dd>{time.format(event.centerDays)} días</dd></div>
            <div><dt>Intervalo bajo umbral</dt><dd>{time.format(event.startDays)} a {time.format(event.endDays)} días</dd></div>
            <div><dt>Duración bajo umbral</dt><dd>{time.format(event.endDays - event.startDays)} días</dd></div>
            <div><dt>Profundidad medida</dt><dd>{depth.format(event.depth)} de flujo normalizado ({ppm.format(event.depth * 1e6)} ppm)</dd></div>
            <div><dt>Muestras del evento</dt><dd>{event.sampleCount}</dd></div>
          </dl>
        </li>)}</ol>
      </>}
      {result.warnings.length > 0 && <div className="detection-warnings"><h3>Advertencias del análisis</h3><ul>{result.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></div>}
    </div>}
    <p className="detection-limit">Una señal compatible con un tránsito no confirma un planeta. El modelo usa datos simulados y simplificaciones; el ruido puede ocultar eventos o producir candidatos espurios.</p>
  </section>;
}
