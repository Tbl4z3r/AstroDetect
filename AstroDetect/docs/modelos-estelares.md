# Modelos estelares educativos

Extensión solicitada por el usuario el 2 de noviembre de 2026: seleccionar estrellas de secuencia principal y explicar las compactas por separado. Modelo y contrato 1.1.0; no modifica la versión de release ni el registro.

| Modelo | Clase orientativa | Masa / M☉ | Radio / R☉ |
|---|---|---:|---:|
| Enana roja | M | 0,3 | 0,3 |
| Enana naranja | K | 0,7 | 0,7 |
| Similar al Sol | G | 1 | 1 |
| Más caliente | F | 1,3 | 1,4 |

Son ejemplos didácticos internos, no mediciones de estrellas concretas ni una tabla universal de clase a masa y radio. Las clases describen principalmente el espectro y la temperatura. Los colores son ilustrativos; no se calcula temperatura, luminosidad absoluta ni respuesta de un telescopio. [NASA, estrellas y exoplanetas](https://science.nasa.gov/exoplanets/stars/).

Elegir un perfil modifica juntos masa y radio; conserva planeta, período, ruido y semilla; reinicia el reloj e invalida la detección. Editar masa o radio muestra «Configuración libre» si ya no coincide con un perfil. Una combinación libre no constituye un modelo de evolución estelar.

## Cálculos y compatibilidad

`μ★ = μ☉ × starMassSolar`; `a = [μ★ (86400P)² / (4π²)]^(1/3)`. Multiplicar la masa por ocho duplica el semieje a período fijo. La masa planetaria se desprecia. [NASA Exoplanet Archive, definiciones](https://exoplanetarchive.ipac.caltech.edu/docs/TableColumnDescriptors.html).

La profundidad central continúa siendo `δ = (Rp/R★)²`, porque el nuevo dominio conserva `Rp < R★`. La duración es `T14 = P/π × asin[(R★+Rp)/a]`. Fase, flujo relativo `F/F0`, ruido y detector se conservan. El color no modifica por sí solo el flujo normalizado. [NASA Exoplanet Archive, profundidad](https://exoplanetarchive.ipac.caltech.edu/docs/transit/transit_algorithms.html).

Masa 0,2–1,6 M☉ y radio 0,2–2 R☉; se exige `a > R★+Rp`. El solapamiento usa la suma equivalente de segmentos circulares para reducir cancelación cerca de los contactos. `starMassSolar` es opcional: omitirlo equivale a 1 M☉. El caso solar conserva su física, muestreo y ruido; la expresión equivalente puede variar los últimos bits dentro de las tolerancias. Una masa explícita inválida se rechaza.

Siguen existiendo 5.001 muestras en cinco períodos, con `Δt=P/1000`. Los centros coinciden deliberadamente con muestras, no con una fase de observación aleatoria. Se avisa si `T14 < 3Δt`; un tránsito puede estar presente sin suficientes puntos bajo el umbral. El detector no recibe parámetros verdaderos ni se garantiza detección.

## Compactas fuera del selector

Las gigantes tienen envolturas extendidas. Las enanas blancas son remanentes de tamaño comparable a la Tierra; las estrellas de neutrones concentran masa estelar en unas decenas de kilómetros. [NASA, tipos estelares](https://science.nasa.gov/universe/stars/types/).

Un planeta puede ocultar por completo una compacta: la profundidad central se limita a `min[1,(Rp/R★)²]`. Se necesitarían otras escalas visuales y temporales y un modelo de la emisión observada. Una ocultación ideal no equivale a simular fielmente una estrella de neutrones; una órbita distante tampoco exige por definición rehacer toda la dinámica con relatividad.

Los planetas de algunos púlsares se detectan mediante cambios en la llegada de pulsos, un método distinto al detector de brillo de AstroDetect. [NASA NTRS, descubrimiento mediante pulsos](https://ntrs.nasa.gov/citations/19920021993). Ese fenómeno se reserva para otro módulo.

Fuentes consultadas el 2 de noviembre de 2026. No se hacen consultas externas durante el uso.
