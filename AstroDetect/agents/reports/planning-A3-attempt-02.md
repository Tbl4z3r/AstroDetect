# Corrección de planificación A3 · intento 02

- Autor: A3.
- Fecha: 26 de octubre de 2026.
- Referencia anterior: `agents/reports/planning-A3.md`.
- Hallazgos atendidos: H1, H2 y H3 de `agents/reviews/planning-A3-by-A1.md`.
- Estado propuesto: `REVIEW`. Producción actualiza el registro; A1 revalida los documentos de A3.
- No se creó commit ni se publicó contenido.

## Cambios y verificación documental

H1: se conservaron las correcciones ya efectuadas al leer el contrato: opciones recibidas, mínimo `max(7, minSamples)`, cantidad de eventos y tolerancia configurables, estados técnicos exactos y salida sin campos adicionales. Los valores 4, 3, 3, 0.10 y 1e-8 se identifican como iniciales.

H2: el rol A3 ahora propone `REVIEW` o `BLOCKED` exclusivamente en su reporte. Sólo producción actualiza los estados de ficha y registro. Se revisaron tanto la regla 7 como el apartado de término para evitar instrucciones contradictorias.

H3: la validación se aplica a los elementos y pares temporales presentes. Una serie vacía o de una muestra válida devuelve `insufficient-data`, sin exigir dos tiempos y antes de calcular medianas o cadencia. Una muestra no finita continúa siendo inválida.

Se releyeron las reglas y se buscaron los textos sustituidos. No se ejecutaron pruebas funcionales: el alcance de esta corrección es documental.

## Entrega exacta · SHA-256 local

- `docs/calidad-y-despliegue.md`: `F970B7DF60E765314E9A75668A1FFDFB7EDE37AC2792F6D0D6164317D8C17D53`.
- `agents/instructions/03-analisis-calidad.md`: `18F061FE6B57047680F6AD6A5B42BEF5BCE68AC8E4F56A4B1FCFC5F182A945F6`.

Estos identificadores corresponden a contenido local, no a commits Git. Se conservaron el reporte y los hallazgos previos. Siguiente responsable: A1 para revisión y producción para integración. No se inició implementación.
