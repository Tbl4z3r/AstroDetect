import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

const steps = [
  { target: 'stellar-system', title: 'Radio de la estrella', description: 'Elige un modelo estelar: ajusta su radio y su masa juntos. Un radio mayor reduce la fracción de luz que tapa el mismo planeta. La masa cambia la distancia que calcula Kepler para el período elegido. Si editas estos valores, pasas a una configuración libre.' },
  { target: 'planetRadiusEarth', title: 'Radio del planeta', description: 'Este valor expresa el tamaño del planeta en radios terrestres. Un planeta mayor cubre más superficie de la estrella y produce una caída de brillo más profunda. Cambias el radio, no el diámetro.' },
  { target: 'periodDays', title: 'Período orbital', description: 'Es el tiempo, en días, que tarda el planeta en dar una vuelta. El modelo usa ese período para calcular la distancia orbital y simula cinco vueltas completas.' },
  { target: 'noisePpm', title: 'Ruido de medición', description: 'Añade fluctuaciones a las mediciones de brillo. Se expresa en partes por millón, o ppm. Aumentarlo hace más difícil reconocer una caída; la órbita y el flujo limpio permanecen iguales.' },
  { target: 'seed', title: 'Semilla del ruido', description: 'La semilla permite repetir la misma realización del ruido. Con los mismos parámetros y semilla se obtienen los mismos datos. Reproducir la animación no genera mediciones nuevas.' },
  { target: 'model', title: 'Referencia de tu experimento', description: 'Estos números describen el sistema que configuraste y sus valores calculados. La masa corresponde al modelo estelar elegido o a tu ajuste manual. En «Entender» puedes seguir las fórmulas y conversiones que originan los resultados.' },
  { target: 'orbit', title: 'Perspectiva libre de la órbita', description: 'Puedes girar y acercar la cámara para explorar el sistema. Es un esquema con la distancia orbital comprimida y, cuando se indica, el planeta ampliado. La cámara no cambia la medición de brillo.' },
  { target: 'observer', title: 'La mirada del observador', description: 'Esta vista mantiene la dirección desde la que se calcula la curva. Cuando el planeta pasa frente al disco estelar, tapa parte de su luz. La proporción entre ambos radios se conserva.' },
  { target: 'playback', title: 'Un mismo tiempo para las dos vistas', description: 'Reproduce, pausa o recorre el tiempo para conectar la posición del planeta con el cursor del gráfico. «Ir al primer tránsito» lleva al centro de la primera ocultación. La velocidad de reproducción sólo cambia la visualización.' },
  { target: 'curve', title: 'La huella del tránsito en la luz', description: 'El flujo normalizado compara el brillo con su referencia sin ocultación: 1 significa el brillo completo. Cada caída puede revelar un tránsito. Compara la medición con ruido con la referencia limpia y presta atención a la escala vertical ampliada.' },
  { target: 'detection', title: 'Buscar evidencia en las mediciones', description: 'La búsqueda analiza el brillo observado para identificar posibles caídas y su repetición. Una señal candidata no confirma un planeta, y no detectar una señal tampoco demuestra que no exista.' },
  { target: 'navigation', title: 'Continúa con las fórmulas y experimentos', description: '«Observar» reúne la simulación y sus mediciones. «Entender» explica los cálculos con los valores de tu experimento. «Experimentar» prepara comparaciones para contrastar tus predicciones. Puedes volver a abrir esta guía cuando quieras.' },
];

interface Layout {
  highlight: CSSProperties | null;
  caption: CSSProperties;
  missing: boolean;
}

export default function GuidedTour({ onClose, onStepChange }: { onClose: () => void; onStepChange?: (index: number) => void }) {
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState<Layout>({ highlight: null, caption: { left: 16, bottom: 16 }, missing: false });
  const dialog = useRef<HTMLDialogElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const step = steps[index];

  useLayoutEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
    return () => { if (element?.open) element.close(); };
  }, []);

  useEffect(() => { onStepChange?.(index); }, [index, onStepChange]);

  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]'))
      .filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (!event.currentTarget.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  useLayoutEffect(() => {
    let frame = 0;
    const target = document.querySelector<HTMLElement>(`[data-guide="${step.target}"]`);
    const clamp = (value: number, lower: number, upper: number) => Math.max(lower, Math.min(upper, value));

    function measure(scrollToTarget = false) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = Math.min(360, viewportWidth - 32);
      const panelHeight = Math.min(caption.current?.getBoundingClientRect().height ?? 280, viewportHeight * 0.55);
      const panelStyle: CSSProperties = { width: panelWidth, maxHeight: viewportHeight * 0.55 };
      if (!target || target.getClientRects().length === 0) {
        setLayout({ highlight: null, caption: { ...panelStyle, left: (viewportWidth - panelWidth) / 2, bottom: 16 }, missing: true });
        return;
      }
      let bounds = target.getBoundingClientRect();
      const roomRight = viewportWidth - bounds.right >= panelWidth + 32;
      const roomLeft = bounds.left >= panelWidth + 32;
      const sidePlacement = viewportWidth >= 700 && (roomRight || roomLeft);
      const availableHeight = sidePlacement ? viewportHeight - 32 : viewportHeight - panelHeight - 48;
      const availableBottom = 16 + availableHeight;
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, availableBottom) - Math.max(bounds.top, 16));
      const minimumVisibleHeight = Math.min(80, bounds.height, availableHeight);
      if (scrollToTarget || visibleHeight < minimumVisibleHeight - 1) {
        const desiredTop = 16 + Math.max(0, (availableHeight - bounds.height) / 2);
        const distance = bounds.top - desiredTop;
        if (Math.abs(distance) > 1) {
          window.scrollBy({ top: distance, behavior: 'instant' });
          bounds = target.getBoundingClientRect();
        }
      }
      const highlightBottom = sidePlacement ? viewportHeight - 8 : availableBottom;
      const visibleTop = clamp(bounds.top - 8, 8, Math.max(8, highlightBottom - 8));
      const visibleBottom = clamp(bounds.bottom + 8, visibleTop + 8, highlightBottom);
      const visibleLeft = clamp(bounds.left - 8, 8, viewportWidth - 16);
      const visibleRight = clamp(bounds.right + 8, visibleLeft + 8, viewportWidth - 8);
      const panelLeft = sidePlacement ? (roomRight ? bounds.right + 20 : bounds.left - panelWidth - 20) : (viewportWidth - panelWidth) / 2;
      const panelTop = sidePlacement ? clamp(bounds.top, 16, viewportHeight - panelHeight - 16) : viewportHeight - panelHeight - 16;
      setLayout({
        highlight: { left: visibleLeft, top: visibleTop, width: visibleRight - visibleLeft, height: visibleBottom - visibleTop },
        caption: { ...panelStyle, left: panelLeft, top: panelTop },
        missing: false,
      });
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => measure());
    }
    function resize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => measure(true));
    }
    measure(true);
    frame = requestAnimationFrame(() => measure(true));
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', schedule, true);
    const observer = new ResizeObserver(schedule);
    if (caption.current) observer.observe(caption.current);
    if (target) observer.observe(target);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', schedule, true);
      observer.disconnect();
    };
  }, [step]);

  return <dialog ref={dialog} className="tour-dialog" aria-labelledby="tour-title" aria-describedby="tour-description" aria-modal="true" onKeyDown={containFocus} onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className={`tour-highlight${layout.highlight ? '' : ' tour-highlight-empty'}`} style={layout.highlight ?? { inset: 0 }} aria-hidden="true" />
    <div className="tour-caption" ref={caption} style={layout.caption}>
      <div className="tour-heading"><p className="tour-progress" aria-live="polite">Guía · Paso {index + 1} de {steps.length}</p><button type="button" className="tour-close" onClick={onClose} autoFocus>Cerrar guía</button></div>
      <h2 id="tour-title">{step.title}</h2>
      <p id="tour-description">{step.description}</p>
      {layout.missing && <p className="tour-unavailable">Este elemento reaparece al corregir la configuración. Puedes continuar la guía y volver al laboratorio al cerrarla.</p>}
      <div className="tour-actions"><button type="button" className="secondary-button" onClick={() => setIndex(previous => previous - 1)} disabled={index === 0}>Atrás</button><button type="button" onClick={() => index === steps.length - 1 ? onClose() : setIndex(previous => previous + 1)}>{index === steps.length - 1 ? 'Terminar' : 'Siguiente'}</button></div>
    </div>
  </dialog>;
}
