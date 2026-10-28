# Producción — preparación del esquema de cuatro ramas

Fecha: 28 de octubre de 2026. Encargo: sustituir las 23 ramas remotas por develop, qa, main y production, conservando el proyecto integrado y su historial.

## Estado comprobado antes de publicar esta configuración

- Main de partida: `1d1cac9500ddc507613eba8691d7bb51ee9318d7`, con T407 integrado por PR #16. Sin PR abiertos al consultar GitHub.
- Inventario: 22 ramas antiguas además de main; 16 puntas integradas y seis puntas con un commit de auditoría o revisión fuera de main.
- Creado y verificado con `git bundle verify` un respaldo completo fuera del repositorio: `outputs/respaldo-ramas-2026-10-28/ramas-1d1cac9.bundle`. SHA-256: `9CF1DE0FFD3C2EBF4FABA7FCC92B2AB6617877FF4CF649F626ABFE2C1862766B`.
- Las seis puntas no integradas tienen etiquetas locales de archivo, que se publican junto con el cambio de ramas. El inventario completo está en `docs/ramas-archivo.json`.

## Configuración entregada

CI valida pushes y PR a las cuatro ramas. Pages sólo construye y publica desde production, sin depender de PAGES_AUTO_DEPLOY. La ejecución sigue comprobando T402 DONE, pruebas y artefacto del mismo SHA. Se actualizan las instrucciones y se añade docs/ramas.md. No se modifica código de la aplicación, contratos ni dependencias.

Se registra T407 DONE con su commit de integración ya existente. Se conservan las asignaciones históricas y T405 como extensión futura sin iniciar.

## Verificaciones ejecutadas

Windows, Node 22.12.0 y npm 10.9.0: instalación reproducible, lint, control de comentarios, tipos y build satisfactorios. El build conserva la advertencia de tamaño del chunk 3D diferido preexistente; no se añade una modificación de producto para resolverla en este encargo.

Los dos workflows se parsearon como YAML y se comprobaron ramas de entrada, condiciones de publicación, dependencia build→deploy, permisos y ubicación del artefacto. Registro e inventario consistentes. Las pruebas unitarias y e2e se vuelven a ejecutar en GitHub sobre el commit publicado; este reporte de preparación no declara su resultado futuro.

## Operación de publicación

Publicar la configuración en las cuatro ramas alineadas y las seis etiquetas, retirando las 22 ramas antiguas mediante una operación atómica con comprobación del SHA esperado en cada eliminación. Si una referencia cambió, detenerse y volver a inspeccionarla. No reescribir main ni borrar copias locales o worktrees ajenos.

Después comprobar el listado remoto exacto, las ejecuciones de CI y el despliegue desde production, y guardar el resultado final junto al respaldo. Este documento registra la preparación; no sustituye la evidencia de esas operaciones posteriores.
