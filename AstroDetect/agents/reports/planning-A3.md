# Reporte de planificación A3

- Tarea: definir análisis básico, control de calidad, revisión cruzada y ruta de despliegue.
- Agente: A3, análisis y calidad.
- Fecha: 26 de octubre de 2026.
- Estado: documentación entregada a producción para integración. Implementación de la aplicación pendiente.
- Referencia: archivos locales de esta entrega; no se creó commit ni se verificó un SHA remoto.

## Cambios realizados

Se creó `docs/calidad-y-despliegue.md` con separación entre la verdad del simulador y el detector, regla auditable de mediana/MAD, tratamiento del caso sin ruido, agrupación mínima, regla de repetición y límites. Se definieron fixtures independientes, criterios de revisión, controles previstos y publicación estática. Se creó `agents/instructions/03-analisis-calidad.md` con permisos de escritura, límites de trabajo, revisión de A2 y condición de parada.

## Verificación efectuada

Se consultaron las páginas oficiales de GitHub sobre Pages y sus límites. Se revisó la coherencia documental de los estados, la necesidad de tres eventos para estimar repetición y la prohibición de usar el período verdadero. No se ejecutaron pruebas de algoritmo, interfaz, compilación, integración continua o carga, porque esta tarea no implementa software.

Fuentes: [Qué es GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) y [límites de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## Riesgos y dependencias

- Producción debe fijar el contrato tipado; las etiquetas y semántica propuestas se alinearán con él antes de implementar.
- La regla de umbral puede perder señales ruidosas y producir falsos positivos. Ningún texto debe presentarla como confirmación de un planeta.
- Los comandos de calidad y el flujo de publicación descritos son requisitos futuros, todavía no están configurados.
- Activar Pages y subir contenido requiere una cuenta con permisos de escritura; no se realizó publicación.

## Entrega al siguiente agente

Producción integra estos documentos con los de A1 y A2. A1 deberá revisar el futuro detector; A3 revisará la futura interfaz de A2. La siguiente acción autorizada de implementación debe llegar como una microtarea con archivos y criterios definidos. No se iniciaron tareas adicionales.

## Ajuste solicitado por producción

Se leyó `docs/contratos.md` y se alinearon los documentos de A3 con los nombres exactos `candidate`, `no-evidence` e `insufficient-data`; sus traducciones se reservan a la interfaz. Los mínimos, umbral, tolerancia y piso se obtienen de `DetectionOptions`, incluidos los criterios `max(7, minSamples)` y `minEventsForPeriod`. Se retiró la propuesta de ampliar la salida con parámetros o escala; las opciones se registran desde la entrada junto al resultado. Se agregó revisión documental de A2 en `agents/reviews/planning-A2-by-A3.md`. No se ejecutaron pruebas de software.
