# Revisión documental de A1 por A2

Fecha: 26 de octubre de 2026. Autor de revisión: A2. Alcance autorizado: `docs/modelo-cientifico.md` y `agents/instructions/01-ciencia.md`, contrastados con `docs/contratos.md` y `docs/colaboracion.md`.

Dictamen de esta revisión: **cambios requeridos**, limitado a la discrepancia de valores iniciales que A1 ya tiene asignado corregir. No se emite aprobación funcional ni cierre de implementación.

## Referencia revisada

Revisión sobre archivos locales del paquete de planificación, sin commit remoto. SHA-256 de las versiones leídas:

- `docs/contratos.md`: `EAF9DFD14415E3A3718C9B3DDBEA4A3DEF476DE084C5B17CDBC9CE624ECA191F`.
- `docs/colaboracion.md`: `240BDC569280A546DA4CAF27D3B50C10684DBE622AF53C2922B6D3ABD2CE7F77`.
- `docs/modelo-cientifico.md`: `D48BD3BE55E3B58D6520BC70176F1C3EF0EFA1F9D43052BECBAF972CBB0BF122`.
- `agents/instructions/01-ciencia.md`: `55BCA68EEFA821100FD429C243E94CA0738BDF7950F6E3620572B8318FE29BC4`.

Una edición posterior del modelo científico debe revalidarse; este dictamen no cubre automáticamente otra revisión del archivo.

## Hallazgo documental H1

- Severidad: media; impide aprobar la consistencia documental de esta entrega, sin constituir un defecto funcional observado.
- Ubicación: `docs/modelo-cientifico.md`, sección «Entradas, unidades y validación», propuesta de configuración inicial.
- Reproducción: comparar esa propuesta con «Valores iniciales» en `docs/contratos.md`. Se leyó nuevamente la línea después de la primera inspección y conservaba la diferencia.
- Esperado: radio estelar 1, radio planetario 10, período 5 días, ruido 500 ppm y semilla 42, según el contrato central.
- Observado: mismos radios y semilla, pero período 3 días y ruido 300 ppm.
- Impacto: los agentes podrían implementar estados iniciales y ejemplos diferentes, dificultando integrar y reproducir el escenario de inicio.
- Corrección esperada: A1 alinea la propuesta con el contrato central; no requiere cambiar el contrato ni ampliar alcance. Producción informó que esta corrección ya está asignada. Esta revisión no la implementó.

## Consistencia comprobada en los documentos

1. **Geometría delante y detrás:** el modelo sitúa al observador en z positivo, usa `z = a cos θ` y sólo atenúa el flujo para `z > 0`. En `t0` el planeta está delante; medio período después está detrás y el flujo limpio vuelve a 1. Esto concuerda con `Position.inFront` y evita dos tránsitos por órbita.
2. **Órbita y unidades:** se deriva el semieje del período con masa solar fija; no existe un semieje independiente. Se valida `a > R + r`, el tiempo público está en días y el cálculo dinámico convierte a segundos.
3. **Muestreo:** `t_j = jP/1000`, para índices de 0 a 5000, produce 5001 muestras, cubre cinco períodos e incluye los extremos. Los cinco centros indicados son coherentes con `t0 = P/2`.
4. **Ocultación:** el modelo separa los casos sin intersección, inclusión completa e intersección parcial antes de dividir por la distancia. Declara el flujo limpio dentro de [0,1] y mantiene brillo uniforme como simplificación.
5. **Ruido:** se usa ruido gaussiano aditivo con desviación `noisePpm × 10⁻⁶`, sin recorte de mediciones. La semilla cero se trata expresamente y no deja trabado el generador. El algoritmo y su consumo por muestra se documentan. Las tolerancias se distinguen de identidad binaria entre plataformas.
6. **Sincronización y separación:** se exige un solo tiempo de simulación para animación y cursor, no regenerar ruido por cuadro y retirar resultados cuando cambian parámetros. El detector sólo recibe tiempos y mediciones, sin flujo limpio ni verdad orbital.
7. **Colaboración y término:** el rol A1 limita cambios a la microtarea, exige evidencia, reporte separado y entrega para revisión. No permite autoaprobación ni tomar tareas nuevas. Su revisión de A3 coincide con el circuito establecido.

## Verificación realizada y límites

Se efectuó lectura comparada y comprobación algebraica documental de fase y muestreo. Se calcularon huellas de archivos para identificar la entrega. No hay aplicación ejecutada en esta revisión: no se corrieron pruebas numéricas, de interfaz, del generador, del detector o del alojamiento. No se auditaron las referencias bibliográficas en la web; el alcance fue consistencia interna con el contrato y el protocolo.

## Condición para cerrar esta revisión

A1 entrega el modelo con los valores iniciales alineados. El revisor revalida esa modificación y registra su nueva referencia; producción conserva la decisión de integración. El resto de las comprobaciones descritas no presentó contradicciones documentales dentro de este alcance. A2 se detiene al entregar este reporte.
