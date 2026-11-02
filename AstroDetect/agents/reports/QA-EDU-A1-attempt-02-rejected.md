# QA educativa — A1 — Intento 02 rechazado

- Fecha, tarea y versión: 2 de noviembre de 2026, América/Santiago. Prueba de la candidata educativa y atención de la vista 3D ausente comunicada por el usuario.
- Dictamen: NO APTA para main. Se cierra esta ronda de tester; las correcciones y la nueva prueba se registran por separado.
- Autor y persona asignada: A1, rol temporal de tester autorizado por el usuario.
- Base y rama: `509e48e44d47a4a748c9dac783c5a2ada9457fca`, develop y qa. Main permanece en `25a3276901066cf8ed46064810924d1368033008`.
- Referencia de código: 509e48e corrige los operandos y la ubicación de la guía, conservando los motores científicos.
- Reporte previo: [intento 01 rechazado](QA-EDU-A1-attempt-01-rejected.md).
- Contratos y dependencias: sin cambios.

## Alcance y verificaciones ejecutadas

Chromium local, Node 22.12.0. Las pruebas exploratorias de precisión pasan 8/8, incluidas 32 combinaciones de límites, operandos de doble precisión, conversiones, profundidad independiente, fase, tabla e invalidación. La guía pasa 12/12 recorridos y 6/6 escenarios de tamaño y desplazamiento, con foco, área visible separada del caption y desplazamiento estable en tres muestras separadas por 500 ms. No se registraron errores JavaScript en esas matrices. Esto resuelve EDU-QA-01 y EDU-QA-02, pero no acredita la imagen 3D.

El usuario señaló que no veía la simulación. Se inspeccionó su pestaña: mostraba el aviso de WebGL no disponible. Tras restablecer el preview y recargar, la escena volvió a dibujarse con estrella, órbita y controles. No se conserva una traza de la carga original, por lo que no se atribuye su causa a WebGL ni a la red como hecho probado.

Se confirmó por separado EDU-QA-03: durante la guía, el render continuo se pausa; redimensionar el canvas borra su imagen sin solicitar un nuevo dibujo. La escena queda negra aunque sus controles sigan habilitados. Una regresión de imagen sobre la compilación 509e48e falló al cambiar de 1280×900 a 1100×900 en el paso orbital: esperaba más de 100 píxeles cálidos de la estrella y obtuvo 0 durante los 5 segundos de espera. Las capturas de la matriz de tamaños también muestran este fallo. La visibilidad del elemento canvas por sí sola no lo detecta.

Además, el aviso existente usa el mismo diagnóstico de WebGL para un módulo 3D que no se descargó y no ofrece recuperación. Se requiere distinguir carga e inicio gráfico, permitir recargar ante un fallo de descarga y reintentar el inicio gráfico sin perder los datos del experimento.

La ejecución completa iniciada sobre 509e48e perdió su sesión de salida al cambiar el contexto; no se registra como batería aprobada. La nueva ronda debe ejecutar y conservar la batería completa sobre el commit corregido.

## Evidencia y continuidad

[Evidencia de la ronda](../evidence/QA-EDU-2026-11-02/attempt-02/) contiene las matrices y capturas pertinentes. Se conserva la expectativa independiente que detectó la imagen negra; no se cambia para aceptar un canvas vacío. El arnés externo tuvo un error de formato de miles durante su preparación, corregido antes del resultado final; no fue un defecto de producto.

Se rechaza la promoción de 509e48e a main y se termina el rol de tester de esta ronda. La instrucción del usuario autoriza corregir en develop, volver a qa y repetir los controles antes de integrar. Production queda fuera del alcance. No se actualiza el registro compartido ni se declara DONE.
