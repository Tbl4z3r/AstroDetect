# Reporte de planificación A1

Fecha: 26 de octubre de 2026. Tarea: especificar el modelo científico y preparar instrucciones del agente A1. Estado: ENTREGADO_PARA_REVISION.

## Cambios realizados

- Creado docs/modelo-cientifico.md: alcance, constantes nominales, unidades, Kepler, posición delantera/trasera, solapamiento exacto, flujo, muestreo, ruido reproducible y criterios numéricos.
- Creado agents/instructions/01-ciencia.md: contexto obligatorio, fronteras de trabajo, revisión científica de A3 y reglas de parada.

## Evidencia y verificaciones

Se consultaron NASA «What's a transit?», IAU Resolución B3 de 2015 y la documentación oficial de constantes de Astropy. Se revisó la coherencia algebraica de las convenciones de fase: t0 = P/2, centros delanteros cada P y traseros a P/2 de ellos. Se verificó por inspección que el muestreo incluye 5001 puntos y cinco centros delanteros.

No se implementó aplicación, no se ejecutaron pruebas de software y no se generaron datos experimentales. Los criterios de pruebas del documento son requisitos para versiones futuras.

## Contratos a integrar

Entradas propuestas: starRadiusSolar 0.5..2, planetRadiusEarth 1..20, periodDays 1..30, noisePpm 0..5000, seed uint32. Masa estelar fija, inclinación de 90°, cinco períodos y 1000 intervalos por período. El detector recibe únicamente tiempos y flujo observado con opciones públicas. Producción debe conciliar estos nombres con el contrato central antes de dar inicio a implementación.

## Riesgos y límites

La escala orbital puede requerir representación esquemática claramente rotulada. La cadencia depende de P. El caso central garantiza tránsitos y no enseña aún el efecto de inclinación. Cambiar Rstar manteniendo la masa no describe una familia completa de modelos estelares. El algoritmo de ruido propuesto debe conservarse o versionarse para reproducibilidad; la semilla cero tiene una equivalencia de secuencia documentada.

## Próximo paso acotado

Revisión independiente de esta especificación y congelación del contrato por producción. A1 espera una microtarea de implementación; no inicia desarrollo por su cuenta.
