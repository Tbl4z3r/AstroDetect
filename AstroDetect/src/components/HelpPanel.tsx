import { SAMPLING } from '../contracts';

export default function HelpPanel() {
  return <section aria-labelledby="apoyo">
    <h2 id="apoyo">5. Apoyo para aprender</h2>
    <h3>Predice antes de observar</h3>
    <p>¿Esperas una disminución más profunda o más superficial al aumentar el radio del planeta? ¿Qué cambiaría al aumentar el radio de la estrella?</p>
    <p>Cuando la simulación esté integrada, compara primero los tamaños y después aumenta el ruido manteniendo la semilla. Argumenta qué evidencia apoyaría tu interpretación y qué límites tendría.</p>
    <h3>Supuestos del modelo</h3>
    <p>Se usarán datos simulados, no mediciones de telescopios: una estrella de brillo uniforme y un planeta opaco, con órbita circular, masa estelar fija de una masa solar e inclinación fija de 90°. Cambiar el radio estelar es una exploración geométrica a masa fija.</p>
    <p>El modelo no incluye manchas estelares, oscurecimiento de limbo, atmósferas, órbitas excéntricas ni ruido correlacionado. La orientación fija garantiza tránsitos en los escenarios válidos; no representa sistemas orientados al azar.</p>
    <p>La observación prevista abarcará {SAMPLING.periods} períodos y {SAMPLING.samples} muestras. Su ventana y cadencia dependerán del período configurado: es una simplificación didáctica, no un resultado del detector.</p>
    <p>El ruido puede ocultar señales o generar candidatos espurios. No se ofrecen porcentajes de certeza ni confirmación de planetas.</p>
    <h3>Referencia del proyecto</h3>
    <p>AstroDetect — Bastián Echeverría, Alexander Ferias y Emiliano Toledo.</p>
    <p><a href="https://github.com/Tbl4z3r/AstroDetect">Repositorio y documentación de AstroDetect</a></p>
  </section>;
}
