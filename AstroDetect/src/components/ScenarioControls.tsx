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

function initialValues(): Record<keyof Scenario, string> {
  return Object.fromEntries(fields.map(({ key }) => [key, String(DEFAULT_SCENARIO[key])])) as Record<keyof Scenario, string>;
}

export default function ScenarioControls({ onScenarioChange }: { onScenarioChange: (scenario: Scenario | null) => void }) {
  const [values, setValues] = useState(initialValues);
  const [notice, setNotice] = useState('');
  function updateValues(next: Record<keyof Scenario, string>) {
    setValues(next);
    setNotice('');
    const scenario = Object.fromEntries(fields.map(({ key }) => [key, Number(next[key])])) as unknown as Scenario;
    onScenarioChange(fields.some(({ key }) => next[key].trim() === '') || !validateScenario(scenario).valid ? null : scenario);
  }
  return <section aria-labelledby="configuracion">
    <h2 id="configuracion" tabIndex={-1}>1. Configuración</h2>
    <p>Cada cambio válido regenera los datos simulados y vuelve al inicio en pausa. Cambia un parámetro a la vez y formula una predicción.</p>
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
          <p id={`${key}-help`}>{help} Límites: {min} a {max}, inclusive.</p>
          <input id={key} type="number" required min={min} max={max} step={key === 'seed' ? 1 : 'any'} value={raw}
            aria-invalid={Boolean(error)} aria-describedby={`${key}-help ${key}-error`}
            onChange={event => updateValues({ ...values, [key]: event.target.value })} />
          <p className="field-error" id={`${key}-error`} aria-live="polite">{error}</p>
        </div>;
      })}</div>
      <button type="button" onClick={() => { updateValues(initialValues()); setNotice('Configuración restablecida a los valores iniciales y datos regenerados.'); }}>Restablecer configuración</button>
      <p role="status">{notice}</p>
    </fieldset>
  </section>;
}
