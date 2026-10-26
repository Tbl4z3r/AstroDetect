# AstroDetect: experiencia educativa

Estado: diseño entregado; implementación pendiente. Versión de diseño: 0.1. Fecha: 26 de octubre de 2026.

## Propósito

Relacionar una configuración astronómica simulada con una disminución de flujo medido y distinguir una señal compatible con un tránsito de una confirmación planetaria. La interfaz debe permitir formular una predicción, observar una consecuencia y justificar una interpretación considerando el ruido y las simplificaciones del modelo.

Equipo académico: Bastián Echeverría, Alexander Ferias y Emiliano Toledo. Las carreras y la distribución de responsabilidades entre estudiantes están pendientes de información; los roles de IA no representan carreras ni asignaciones personales.

## Alcance de v0.1

Una estrella, un planeta, órbita circular, inclinación fija de 90 grados, masa estelar fija de una masa solar y datos simulados. La aplicación presenta controles de tamaños y período, animación, curva de flujo con ruido ajustable y detección básica. Los casos desconocidos quedan para v0.2 y no deben retrasar el MVP.

Se propone React, TypeScript, Vite y SVG nativo, ejecutados en el navegador. La ruta de publicación prevista es `/AstroDetect/` en GitHub Pages. Cada visitante mantiene su propia simulación; no hay cuentas, base de datos ni coordinación de sesiones. El objetivo inicial es permitir el uso de hasta diez personas simultáneas, sujeto a verificar la publicación y los límites vigentes del alojamiento.

## Organización de la pantalla

1. Encabezado: nombre, propósito breve y etiqueta permanente «Simulación educativa».
2. Configuración: radios, período, ruido, semilla reproducible y acciones de restablecimiento.
3. Observación: vista de la estrella y el planeta con control de reproducción y tiempo simulado.
4. Medición: curva con ejes «Tiempo (días)» y «Flujo normalizado»; cursor temporal compartido con la animación.
5. Interpretación: botón «Buscar posibles tránsitos», resultados y explicación de límites.
6. Apoyo: instrucciones breves, supuestos del modelo y referencias del proyecto.

En escritorio, configuración y observación pueden compartir una fila; la curva necesita suficiente ancho para interpretar los eventos. En móvil, los bloques se apilan en el orden descrito, sin desplazamiento horizontal de la página. Los resultados se presentan en texto además de cualquier marca gráfica.

## Controles y consistencia de datos

El contrato común fija estos parámetros:

- `starRadiusSolar`: 0,5 a 2 radios solares.
- `planetRadiusEarth`: 1 a 20 radios terrestres.
- `periodDays`: 1 a 30 días.
- `noisePpm`: 0 a 5000 ppm de desviación estándar del ruido.
- `seed`: entero sin signo de 32 bits.

La observación cubre cinco períodos y contiene 5001 muestras. El modelo científico valida el sistema y deriva las magnitudes que correspondan. La interfaz muestra unidades legibles y no convierte píxeles de la animación en unidades físicas.

Cada control numérico tendrá etiqueta, valor actual y límites accesibles. Un deslizador, si se usa, estará acompañado de entrada numérica. Los errores deben describir cómo corregir el valor; una entrada vacía durante la edición no debe producir una simulación con valores inválidos.

Al confirmar un cambio válido de parámetros, se regenera el conjunto de datos de forma determinista, se vuelve al inicio temporal y se invalidan los resultados de detección anteriores. Cambiar sólo el ruido conserva el flujo ideal del sistema y modifica la medición según la misma realización aleatoria escalada. Mantener todos los parámetros y la semilla debe reproducir exactamente el mismo conjunto de datos. «Nueva realización de ruido» cambia explícitamente la semilla y muestra la nueva; reproducir, pausar o mover el cursor nunca la cambia.

## Reproducción y representación

- El mismo tiempo simulado gobierna la posición del planeta y el cursor de la curva.
- «Reproducir» y «Pausar» controlan únicamente la visualización; «Volver al inicio» conserva configuración, datos y resultados vigentes.
- «Restablecer configuración» recupera los valores iniciales aprobados en el contrato, regenera los datos y limpia la detección.
- La velocidad de reproducción debe identificarse como velocidad de visualización, separada del período orbital físico.
- La animación comienza pausada. Con preferencia de movimiento reducido se evita la reproducción automática y las transiciones decorativas; el usuario conserva la posibilidad de avanzar manualmente.
- El esquema orbital o cualquier ampliación de tamaños debe rotularse «Esquema; escalas visuales ajustadas». La curva identifica su intervalo de flujo; un recorte vertical o una ampliación no puede ocultarse.
- La curva distingue mediciones y, si el diseño aprobado muestra una referencia ideal, ambas series tienen leyenda y estilos diferentes. El detector recibe sólo las mediciones.

## Flujo de aprendizaje

1. **Predecir:** antes de cambiar un tamaño, el estudiante explica si espera una disminución más profunda o más superficial.
2. **Experimentar:** modifica un parámetro y observa el mismo evento en la animación y en la curva.
3. **Comparar:** repite con mayor ruido y la misma semilla para distinguir el sistema físico de la calidad de medición.
4. **Analizar:** ejecuta la búsqueda de eventos y contrasta las marcas con las mediciones.
5. **Argumentar:** escribe o expone qué evidencia apoya su interpretación y qué limitaciones impiden confirmar un planeta real.

La evaluación propuesta comprueba si el estudiante relaciona tamaños relativos y profundidad, identifica separaciones temporales compatibles con repetición y distingue falta de detección de ausencia de planeta. Puede utilizarse una pauta previa y posterior con las mismas categorías de logro. No se afirma mejora de aprendizaje ni eficacia hasta realizar y documentar una evaluación real.

## Comunicación de resultados

El componente de resultados usa las categorías y campos del contrato de detección aprobado. Debe explicar al menos estos desenlaces, sin inventar métricas:

- Hay disminuciones compatibles con eventos; mostrar cantidad, tiempos y medidas disponibles.
- Hay evidencia de repetición suficiente para proponer un período; mostrar el período estimado y la condición utilizada.
- Hay un evento aislado o información insuficiente; no mostrar un período como si hubiera sido medido.
- No se identificaron candidatos con los criterios actuales; explicar que eso no demuestra ausencia de planeta.
- La configuración o los datos son inválidos; indicar el error antes de intentar la búsqueda.

Usar «señal compatible con tránsito» o «posible tránsito». Evitar «planeta descubierto», «confirmado» y porcentajes de certeza sin calibración. Los resultados pertenecen al conjunto de datos vigente; cualquier regeneración los retira hasta repetir el análisis.

## Accesibilidad y aceptación

Se debe completar el flujo con teclado, conservar foco visible, vincular etiquetas e inputs y comunicar errores y finalización del análisis mediante texto accesible. No depender exclusivamente de color. La animación debe tener descripción y la curva, un resumen textual de los datos y resultados. No anunciar cada cuadro de animación a lectores de pantalla.

La revisión comprobará pantalla estrecha, zoom del navegador, operación sin ratón, preferencia de movimiento reducido y controles de pausa. El gráfico debe conservar ejes y leyenda legibles. Los límites numéricos se prueban tanto en controles como en la capa de validación. No se declara compatibilidad con un navegador sin comprobarla.

## Fuera de alcance

No implementar todavía retos desconocidos, registro de usuarios, clasificaciones, exportación avanzada, datos de telescopios, varios planetas, excentricidad, ajustes profesionales, chat de IA o backend. Las propuestas nuevas se registran para priorización y no se incorporan a una tarea activa por iniciativa del agente.
