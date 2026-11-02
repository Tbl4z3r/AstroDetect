import { useState } from 'react';
import type { SimulationResult } from '../contracts';

const pageSize = 20;
const format = (value: number, digits = 6) => value.toLocaleString('es-CL', value !== 0 && Math.abs(value) < 10 ** -digits
  ? { notation: 'scientific', maximumFractionDigits: 4 } : { minimumFractionDigits: digits, maximumFractionDigits: digits });

export default function MeasurementTable({ result, timeDays, onSeek }: { result: SimulationResult; timeDays: number; onSeek: (timeDays: number) => void }) {
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const pages = Math.ceil(result.samples.length / pageSize);
  const selected = Math.min(result.samples.length - 1, Math.max(0, Math.round(timeDays / result.cadenceDays)));
  const offset = page * pageSize;
  return <details className="measurement-data" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>Ver los datos de este experimento</summary>
    {open && <>
    <p>La tabla muestra las mismas mediciones internas que la curva. El detector utiliza sólo tiempo y flujo observado; la referencia ideal permite comparar el efecto del ruido.</p>
    <div className="data-navigation"><button type="button" className="secondary-button" disabled={page === 0} onClick={() => setPage(page - 1)}>Página anterior de datos</button><p aria-live="polite">Página {page + 1} de {pages} · Muestras {offset + 1} a {Math.min(offset + pageSize, result.samples.length)} de {result.samples.length}</p><button type="button" className="secondary-button" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Página siguiente de datos</button></div>
    <button type="button" className="text-button" onClick={() => setPage(Math.floor(selected / pageSize))}>Ver la muestra más cercana al cursor</button>
    <div className="measurement-table-scroll" role="region" aria-label="Mediciones de tiempo y flujo" tabIndex={0}>
      <table><caption>Mediciones del escenario actual · flujos sin unidad</caption><thead><tr><th scope="col">Muestra</th><th scope="col">Tiempo (días)</th><th scope="col">Flujo ideal</th><th scope="col">Flujo observado</th><th scope="col">Ruido añadido (ppm)</th><th scope="col">Localizar</th></tr></thead><tbody>
        {result.samples.slice(offset, offset + pageSize).map((sample, index) => <tr key={offset + index} aria-current={selected === offset + index ? 'true' : undefined}>
          <th scope="row">{offset + index + 1}</th><td>{format(sample.timeDays)}</td><td>{format(sample.cleanFlux, 8)}</td><td>{format(sample.observedFlux, 8)}</td><td>{format((sample.observedFlux - sample.cleanFlux) * 1e6, 2)}</td><td><button type="button" className="text-button" aria-label={`Ir a la muestra ${offset + index + 1}`} onClick={() => onSeek(sample.timeDays)}>Ver en curva</button></td>
        </tr>)}
      </tbody></table>
    </div>
    <p>El ruido añadido es (flujo observado − flujo ideal) × 10⁶; puede ser positivo o negativo. Los números se redondean para mostrarlos; los cálculos conservan los datos originales. Consultar una muestra pausa el reloj y conserva la serie y la detección.</p>
    </>}
  </details>;
}
