# Modelo científico de AstroDetect

Estado: especificación inicial para implementar y revisar. Fecha: 26 de octubre de 2026. No corresponde a resultados de una aplicación ya construida.

## Propósito y alcance

Relacionar una ocultación geométrica con la disminución del flujo recibido y la interpretación de una curva de luz. El tránsito permite inferir un posible objeto a partir de mediciones indirectas; una disminución por sí sola no confirma un planeta. Esta motivación se apoya en [NASA, «What's a transit?»](https://science.nasa.gov/exoplanets/whats-a-transit/), consultado el 26 de octubre de 2026.

Versión mínima: una estrella esférica de brillo superficial uniforme y constante, un planeta opaco y oscuro, órbita circular, inclinación fija de 90° y tránsito central. La masa estelar se mantiene en una masa solar nominal y la masa planetaria se desprecia en la dinámica. El cambio de radio estelar es una exploración geométrica: no se modelan relaciones entre masa, radio, temperatura y evolución estelar.

Quedan fuera el oscurecimiento de limbo, manchas, binarias eclipsantes, reflexión y emisión planetaria, atmósferas, excentricidad, movimiento propio, exposición finita y ruido correlacionado. La geometría fija garantiza tránsitos para los parámetros válidos; no representa la probabilidad de observarlos en sistemas orientados al azar.

## Entradas, unidades y validación

- `starRadiusSolar`: radio de la estrella en radios solares nominales, número finito entre 0,5 y 2.
- `planetRadiusEarth`: radio del planeta en radios terrestres ecuatoriales nominales, número finito entre 1 y 20.
- `periodDays`: período orbital en días, número finito entre 1 y 30.
- `noisePpm`: desviación estándar del ruido aditivo en partes por millón del flujo de referencia, número finito entre 0 y 5000.
- `seed`: entero sin signo entre 0 y 4294967295.

Propuesta de configuración de inicio: 1 radio solar, 10 radios terrestres, 5 días, 500 ppm y semilla 42. Los controles deben mostrar unidades y distinguir radio de diámetro. Internamente se convierten las longitudes a metros y los tiempos dinámicos a segundos.

Constantes de conversión fijadas para esta versión: radio solar nominal 695700000 m; radio terrestre ecuatorial nominal 6378100 m; parámetro gravitacional solar nominal μ = 1,3271244 × 10²⁰ m³/s²; un día = 86400 s. Son factores nominales de conversión, no mediciones exactas del Sol y la Tierra actuales. Véase [IAU, Resolución B3 de 2015](https://www.iau.org/static/resolutions/IAU2015_English.pdf) y su aplicación en [Astropy, constantes IAU2015](https://docs.astropy.org/en/stable/constants/index.html).

Rechazar entradas fuera del intervalo, NaN, infinitos, semilla fraccionaria y configuraciones con a ≤ R + r. No corregir silenciosamente los parámetros introducidos por el usuario. R y r representan aquí los radios físicos de la estrella y del planeta. Dentro del alcance actual r < R.

## Órbita y posición observada

La distancia orbital se deriva del período y la masa fija mediante la tercera ley de Kepler:

`a = [μ (86400 P)² / (4π²)]^(1/3)`

P se expresa en días. No ofrecer un control de a independiente de P. La fase usa la misma escala temporal que el gráfico:

`t0 = P/2; θ(t) = 2π(t − t0)/P`

Definir al observador sobre el eje z positivo, estrella centrada en el origen y plano del cielo xy. En el caso de inclinación fija:

`x = a sin θ; y = 0; z = a cos θ; d = |x|`

El planeta está delante de la estrella solamente si z > 0. En t = t0 + kP está centrado delante y en t = t0 + P/2 + kP está centrado detrás. El valor k es entero. El signo de z evita producir dos tránsitos por órbita. Una vista superior auxiliar puede usar el par (x,z), pero debe identificarse como esquema orbital; la vista del observador usa (x,y).

## Ocultación y flujo normalizado

Obtener el área A de intersección de dos discos de radios R y r separados por d. Aplicar las ramas antes de evaluar divisiones:

1. Si d ≥ R + r: A = 0.
2. Si d ≤ |R − r|: A = π min(R,r)²; esto incluye d = 0.
3. En otro caso:

`A = R² arccos[(d² + R² − r²)/(2dR)] + r² arccos[(d² + r² − R²)/(2dr)] − 0,5 √[(-d+R+r)(d+R-r)(d-R+r)(d+R+r)]`

Limitar los argumentos del arccos al intervalo [-1,1] y el radicando a un mínimo de cero para evitar errores de redondeo cerca de los contactos. Estas protecciones numéricas no sustituyen la validación de entrada. El flujo limpio es:

`f_clean(t) = 1 − A/(πR²)` si z > 0; en otro caso `f_clean(t) = 1`.

Físicamente el flujo recibido sería F(t); se presenta f(t) = F(t)/F0, donde F0 es el flujo sin ocultación. Su unidad es adimensional. La profundidad máxima para tránsito central es δ = (r/R)², o δ × 10⁶ ppm. Aumentar el radio planetario al doble cuadruplica la profundidad mientras se mantenga r < R. El radio estelar modifica la profundidad y la duración a masa fija.

La expresión de intersección y las siguientes relaciones son especificaciones matemáticas del modelo geométrico adoptado. Para comprobar la duración total entre contactos:

`T14 = (P/π) arcsin[(R+r)/a]` en días.

El flujo limpio es continuo durante ingreso y egreso, permanece entre 0 y 1 y es simétrico respecto a cada centro de tránsito. No usar una caída rectangular para dibujar el flujo del simulador.

## Muestreo y sincronización

La serie fija contiene 5001 muestras: j entero de 0 a 5000, `t_j = jP/1000`. El intervalo observado es [0,5P], incluidos sus extremos, con cinco centros de tránsito en 0,5P; 1,5P; 2,5P; 3,5P; 4,5P. Cadencia Δt = P/1000 días. No presentar la cadencia como fija en minutos cuando cambia P.

Calcular una serie al confirmar parámetros; la reproducción avanza un único reloj de simulación y mueve tanto el planeta como el cursor del gráfico. Pausar o cambiar la velocidad visual no modifica los datos. No generar ruido nuevo en cada cuadro de animación. Si se cambia un parámetro, invalidar resultados de detección anteriores y generar una serie nueva con la semilla elegida. La vista del tránsito debe usar proporciones físicas entre los dos radios; si se comprime la órbita para que quepa, debe indicarse «distancia orbital esquemática».

## Ruido reproducible

El modelo de medición es `f_observed,j = f_clean,j + σ Z_j`, con σ = noisePpm × 10⁻⁶ y Z_j normal estándar independiente. El ruido se añade al flujo normalizado y no al radio ni a la posición. No recortar las mediciones al intervalo [0,1]: observar puntos mayores que 1 o negativos en una simulación gaussiana no implica un error geométrico.

Para que dos implementaciones produzcan la misma secuencia, fijar este algoritmo antes de implementar: estado x uint32 inicial igual a seed; si seed = 0, usar x = 1831565813. Por cada uniforme, aplicar sucesivamente x ← x XOR (x << 13), x ← x XOR (x >>> 17), x ← x XOR (x << 5), interpretando el resultado como uint32 después de cada operación. Convertir a `U = (x + 0,5)/4294967296`, de modo que 0 < U < 1. Por cada muestra consumir exactamente dos uniformes, U1 y U2, y usar `Z = sqrt(-2 ln U1) cos(2π U2)`; descartar la segunda componente de Box–Muller. Reiniciar el estado al inicio de cada serie. La semilla cero comparte secuencia con la semilla 1831565813 por esta convención explícita.

La aleatoriedad es educativa, no criptográfica. Comparar secuencias de coma flotante con tolerancia numérica, sin exigir identidad binaria de funciones trascendentes entre plataformas. noisePpm = 0 debe devolver exactamente la serie limpia. Incrementar el ruido puede ocultar señales y generar candidatos espurios; no asumir que todo tránsito debe ser detectado.

## Separación entre simulación y detección

El motor físico debe ser independiente del navegador y del DOM. Sus resultados permiten separar: tiempos, flujo observado, flujo limpio para enseñanza y verdad geométrica para evaluación. El detector recibe exclusivamente tiempos y flujo observado, más opciones públicas del algoritmo. Nunca recibe P verdadero, radios, semilla, flujo limpio ni etiquetas de tránsito. Un rango público de búsqueda de períodos puede formar parte de las opciones, siempre que no se ajuste usando el valor verdadero del caso.

En el modo inicial se pueden comparar la curva limpia y la observada. Al evaluar el detector, la verdad se conserva fuera de su entrada y se usa después para medir errores. Reservar el caso desconocido para una versión posterior, con parámetros y curva limpia ocultos hasta la respuesta del estudiante.

La interfaz informará «posibles disminuciones compatibles con un tránsito» y «periodicidad estimada» cuando haya evidencia suficiente. Una no detección significa evidencia insuficiente bajo este algoritmo y configuración, no ausencia demostrada de planeta. Las limitaciones deben acompañar los resultados.

## Criterios científicos verificables

- En el centro delantero el flujo coincide con 1 − (r/R)² dentro de tolerancia absoluta 10⁻¹⁰.
- En el centro trasero el flujo es 1, sin eclipse secundario artificial.
- Las muestras limpias separadas por 1000 índices coinciden dentro de tolerancia 10⁻¹⁰.
- Los cinco centros aparecen en los tiempos especificados y los contactos concuerdan con T14 hasta la resolución de muestreo.
- A noisePpm = 0, observado y limpio coinciden; con iguales parámetros y semilla se reproduce la serie dentro de tolerancia 10⁻¹² en flujo.
- Cerca de contacto, d = 0 y límites de los controles no producen NaN ni infinitos.
- El tamaño físico de cada círculo en la vista del observador conserva r/R.

Estos criterios son requisitos pendientes de ejecución sobre la implementación. No equivalen a pruebas aprobadas.
