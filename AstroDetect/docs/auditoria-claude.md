# Operación del auditor Claude

Esta política agrega una aprobación obligatoria de Claude Code; no sustituye la ficha, contrato, pruebas ni revisión especializada de cada tarea. Entra en vigor al incorporarla a la base compartida aprobada.

## Secuencia

1. El autor termina su alcance, publica su rama/PR y reporte, propone REVIEW y se detiene.
2. Producción verifica la entrega y publica REVIEW en backlog.json, vinculando de manera inequívoca el PR y SHA entregados en la asignación/reporte. El auditor no cambia ese estado.
3. Producción inicia Claude Code con la instrucción de auditor y el ID de tarea, PR, base y SHA. Claude verifica esos datos, reserva su intento y audita en un checkout aislado.
4. Con CHANGES_REQUESTED, producción devuelve al autor los hallazgos; el autor corrige y entrega una referencia nueva. Con BLOCKED, se resuelve la causa sin declarar una aprobación.
5. Con APPROVED, producción verifica procedencia, SHA actual, base, controles y revisiones especializadas requeridas. Después integra y declara DONE; sólo entonces habilita dependencias.
6. Si cambia el código o su base después de la aprobación, no integrar hasta revalidar. No permitir que un commit posterior que adjunta sólo evidencia oculte código nuevo.

El bloqueo se aplica a la tarea y sus dependencias. Las tareas independientes ya autorizadas pueden continuar. Una tarea DONE anterior a esta política no se reabre automáticamente.

## Identidad y límites

Sólo una sesión real de Claude Code puede firmar como AUDITOR-CLAUDE. Un texto de Codex o un archivo sin procedencia verificable no sustituye esa auditoría. Producción debe vincular el reporte a la ejecución/cuenta del auditor, comprobar los hashes y conservar evidencia. Esta comprobación operativa no es una firma criptográfica ni sustituye reglas de acceso de GitHub.

El auditor puede leer el código y ejecutar verificaciones en un entorno aislado; sólo publica reportes y evidencias en su rama propia. No corrige el producto ni cambia estados. Si necesita una corrección, la devuelve al autor. No ejecutar Claude en la misma copia de trabajo que está usando A1, A2 o A3.

## Inicio de cada pasada

Abrir Claude Code en el clon del repositorio y cargar la instrucción 04-auditor-claude.md, indicando una tarea en REVIEW. Si se pide revisar todas, tomar una instantánea de la cola y terminar esa pasada. Si no hay tareas en REVIEW, informar y detenerse. El reporte del autor que sólo propone REVIEW no actualiza por sí mismo el registro compartido.

## Ejecución automática: pendiente

No hay un monitor, hook ni workflow de Claude instalado por esta entrega. Para auditar cada transición sin invocación manual se necesita un disparador y una ejecución autenticada de Claude. La documentación oficial permite GitHub Actions con prompts y eventos, pero deben configurarse permisos, autenticación y disponibilidad/coste de la cuenta. No se incluyen credenciales ni se presupone acceso gratuito.

Para impedir técnicamente un merge sin auditoría también se debe configurar un check obligatorio o regla equivalente en GitHub. Un archivo Markdown por sí solo no bloquea merges. La autenticidad del resultado debe descansar en la ejecución confiable del auditor, no sólo en un archivo que el autor puede editar. El disparador, las credenciales y la protección de rama son trabajo separado; no se activan silenciosamente.

Fuentes verificadas el 26 de octubre de 2026:
- https://code.claude.com/docs/en/memory
- https://code.claude.com/docs/en/github-actions
- https://code.claude.com/docs/en/permissions
