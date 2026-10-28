import { useState } from 'react';
import { DEFAULT_SCENARIO, SCENARIO_LIMITS } from '../contracts';
import type { Scenario } from '../contracts';
import { validateScenario } from '../simulation';

const fields: { key: keyof Scenario; label: string; unit: string; help: string }[] = [
  { key: 'starRadiusSolar', label: 'Radio de la estrella', unit: 'radios solares', help: 'Radio, no diámetro. La masa estelar permanece fija.' },
  { key: 'planetRadiusEarth', label: 'Radio del planeta', unit: 'radios terrestres', help: 'Radio, no diámetro. Predice cómo cambiaría la profundidad del tránsito.' },
  { key: 'periodDays', label: 'Período orbital', unit: 'días', help: 'Tiempo que tarda el planeta en completar una órbita.' },
  { key: 'noisePpm', label: 'Ruido de medición', unit: 'ppm', help: 'Desviación estándar en partes por millón del flujo de referencia.' },
  { key: 'seed', label: 'Semilla del ruido', unit: 'entero sin unidad', help: 'La misma configuración y semilla permitirán reproducir los datos. Cero es válido.' },
];

function initialValues(scenario: Readonly<Scenario>): Record<keyof Scenario, string> {
  return Object.fromEntries(fields.map(({ key }) => [key, String(scenario[key])])) as Record<keyof Scenario, string>;
}

export default function ScenarioControls({ onScenarioChange, initialScenario = DEFAULT_SCENARIO }: { onScenarioChange: (scenario: Scenario | null) => void; initialScenario?: Readonly<Scenario> }) {
  const [values, setValues] = useState(() => initialValues(initialScenario));
  const [notice, setNotice] = useState('');
  function updateValues(next: Record<keyof Scenario, string>) {
    setValues(next);
    setNotice('');
    const scenario = Object.fromEntries(fields.map(({ key }) => [key, Number(next[key])])) as unknown as Scenario;
    onScenarioChange(fields.some(({ key }) => next[key].trim() === '') || !validateScenario(scenario).valid ? null : scenario);
  }
  return <section aria-labelledby="configuracion">
    <p className="section-index">Tu experimento</p><h2 id="configuracion" tabIndex={-1}>Diseña el sistema</h2>
    <p className="control-introduction">Cambia una variable. Predice su efecto.</p>
    <fieldset><legend>Parámetros del escenario</legend>
      <div className="controls-grid">{fields.map(({ key, label, unit, help }) => {
        const { min, max } = SCENARIO_LIMITS[key];
        const raw = values[key];
        const value = Number(raw);
        const error = raw.trim() === '' ? 'Introduce un valor; el campo no puede quedar vacío.'
          : !Number.isFinite(value) ? 'Introduce un número finito.'
          : value < min || value > max ? `Introduce un valor entre ${min} y ${max}, inclusive.`
          : key === 'seed' && !Number.isInteger(value) ? 'Introduce una semilla entera, sin decimales.' : '';
        return <div className="control" key={key}>
          <label htmlFor={key}>{label} ({unit})</label>
          <p id={`${key}-help`} className="control-help">{help} Límites: {min} a {max}, inclusive.</p>
          <input id={key} type="number" required min={min} max={max} step={key === 'seed' ? 1 : 'any'} value={raw}
            aria-invalid={Boolean(error)} aria-describedby={`${key}-help ${key}-error`}
            onChange={event => updateValues({ ...values, [key]: event.target.value })} />
          {key !== 'seed' && <input type="range" min={min} max={max} step={key === 'noisePpm' ? 50 : 0.01}
            value={Number.isFinite(value) ? value : DEFAULT_SCENARIO[key]} aria-label={`Ajustar ${label.toLocaleLowerCase('es-CL')} con deslizador`}
            onChange={event => updateValues({ ...values, [key]: event.target.value })} />}
          <p className="field-error" id={`${key}-error`} aria-live="polite">{error}</p>
        </div>;
      })}</div>
      <button type="button" className="secondary-button" onClick={() => { updateValues(initialValues(DEFAULT_SCENARIO)); setNotice('Configuración restablecida a los valores iniciales y datos regenerados.'); }}>Restablecer configuración</button>
      <p role="status">{notice}</p>
    </fieldset>
  </section>;
}
