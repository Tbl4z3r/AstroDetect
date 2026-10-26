# Plan de producción

## Objetivo y decisión de alcance

AstroDetect conectará astronomía, programación y análisis de datos para que estudiantes relacionen una ocultación geométrica con una disminución del flujo observado. La interfaz permitirá manipular parámetros, comparar señal limpia y ruido, ejecutar un detector y explicar sus límites. El uso será académico y sin fines de lucro.

La v0.1 incluirá exactamente: estrella y planeta únicos, órbita circular, radios y período ajustables, animación sincronizada, curva de flujo normalizado con ruido reproducible y detección básica. La v0.2 podrá añadir un caso desconocido con respuesta razonada. No se incluyen FITS, datos reales, aprendizaje automático, cuentas, multijugador, múltiples planetas, órbitas excéntricas ni evaluación clínica o investigación observacional.

La inclinación se fija a 90 grados y la masa estelar a una masa solar. Los radios pueden variar dentro del rango documentado sin representar una secuencia de evolución estelar. El semieje se calcula con Kepler a partir del período. Cambiar el período modifica la separación y la duración del tránsito, no sólo la velocidad de la animación.

## Gobierno y cargas

El productor mantiene el contexto, prioriza, resuelve conflictos, aprueba cambios de contrato, integra y decide si se cumplen los hitos. Los agentes implementan tareas concretas y revisan trabajo ajeno por turnos:

- A1: geometría, física, generación de series y sus pruebas; revisa el análisis de A3.
- A2: controles, animación, curva y explicación educativa; revisa la simulación de A1.
- A3: detector, pruebas independientes y verificación de interfaz; revisa la interfaz de A2.

Una revisión es una asignación distinta de la implementación. Cada agente tiene como máximo una tarea activa, ya sea de autor o revisor. Al finalizar se detiene. Nadie toma una tarea nueva sin orden del productor. Las unidades del backlog son estimaciones relativas: 1 pequeña, 2 media, 3 amplia; no son horas ni compromisos de calendario. Si una tarea supera una sesión razonable, el agente entrega evidencia parcial y el productor la divide.

## Olas de trabajo

1. T000 prepara la base, congela contratos v1 y deja instalación, validaciones y build reproducibles. Antes de esto no se implementa sobre APIs imaginadas.
2. En paralelo: A1 T101, A2 T201, A3 T301. Cada uno trabaja en su carpeta. Se revisan respectivamente por A2, A3 y A1. El productor integra cada cambio aprobado.
3. A1 T102 y A2 T202 avanzan después de sus dependencias. A3 realiza las revisiones asignadas y después T302. No se le asigna revisión y desarrollo simultáneos.
4. T401 integra; T402 valida experiencia, ciencia y rendimiento. Si hay fallas, crear correcciones F-ID con alcance y revisor, no ampliar tareas cerradas.
5. T403 prepara publicación y T404 construye el informe académico con evidencias reales. T405 añade el caso desconocido sólo después del cierre de v0.1 y una nueva orden.

El grafo exacto y los estados están en agents/tasks/backlog.json. Los estados bloqueados por dependencias no indican un fallo: esperan a que el productor confirme que las predecesoras están DONE.

## Hitos y salida

- v0.0.0: planificación y contratos propuestos, entrega actual.
- v0.1.0-alpha: física, interfaz y detector integrados con pruebas y avisos de limitación.
- v0.1.0: verificaciones de aceptación, revisión independiente y demo estática publicada.
- v0.2.0: caso desconocido con control negativo y justificación del usuario.

No hay fecha prometida: falta la fecha de entrega del curso y la disponibilidad del equipo. No se afirmará que el sistema soporta diez usuarios por una prueba de una sola sesión; se verificará la entrega del sitio y el funcionamiento en diez sesiones independientes, dentro de un presupuesto pequeño de solicitudes.

## Pendientes humanos que no bloquean la planificación

Carreras de los tres estudiantes; curso, docente y universidad para portada; fecha límite; responsables humanos; permiso de escritura en GitHub y de configuración de Pages; elección de licencia. No se inventan estos datos ni se atribuyen especialidades a los estudiantes por sus nombres.
