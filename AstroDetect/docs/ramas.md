# Cuatro ramas permanentes

Política vigente desde el 28 de octubre de 2026, por instrucción del equipo. Sustituye las reglas anteriores de una rama por tarea y las reservas `task/*`, `review/*` o `audit/*`. La política de entrega directa sin revisión de código permanece vigente.

## Función de cada rama

- `develop`: desarrollo e integración de tareas con responsable y archivos asignados. Es la rama de trabajo de los compañeros.
- `qa`: versión candidata sobre la que se ejecutan los controles y se comprueban los recorridos de usuario. QA significa pruebas de calidad del producto, sin auditoría ni revisión cruzada de código.
- `main`: código terminado que superó QA; rama predeterminada de GitHub y referencia estable para consultar el proyecto.
- `production`: versión destinada al sitio público de GitHub Pages. Sólo esta rama activa la publicación.

Se mantienen exactamente estas cuatro ramas remotas. Un estado de tarea, un rol de IA y una rama son conceptos distintos: varias tareas finalizadas pueden pertenecer al mismo commit promovido, y ningún agente obtiene permiso de publicar por llamarse «producción».

## Trabajo entre los tres computadores

Cada persona conserva su clon y recibe un ID, alcance, archivos y criterios de término. Antes de editar, actualizar las referencias y consultar el registro remoto. Los tres trabajan en `develop`, coordinando archivos para no modificar simultáneamente el mismo módulo. No se crean ramas por tarea ni se reutilizan las ramas archivadas.

Con la copia local limpia, ejecutar `git fetch --prune origin`, cambiar a `develop` y ejecutar `git pull --ff-only origin develop`. Si todavía no existe localmente, crear únicamente la rama local que sigue a `origin/develop`, mediante `git switch --track origin/develop`. En clones nuevos se puede usar `git clone --branch develop https://github.com/Tbl4z3r/AstroDetect.git`.

No cambiar de rama ni limpiar archivos si hay trabajo propio sin guardar. Si el avance no es rápido, hay commits divergentes o el push es rechazado, detener la integración y avisar a producción con el estado y los commits. No usar force push, reset destructivo ni descartar trabajo de un compañero. Producción resuelve la combinación conservando ambas entregas y vuelve a comprobarla.

Cada autor modifica exclusivamente sus archivos, ejecuta sus verificaciones y publica sólo sus commits y su reporte en `develop`. Usa una selección explícita al añadir archivos. Propone DELIVERED y se detiene. Producción registra el commit integrado y DONE; un push satisfactorio no prueba por sí solo que una tarea esté terminada.

## Promoción de una versión

1. Producción selecciona un commit de `develop` con las entregas previstas y lo incorpora a `qa`. Si el equipo sigue desarrollando después, esos nuevos commits permanecen en `develop` hasta la siguiente promoción.
2. Sobre el commit exacto de `qa`, completar `npm ci`, lint, tipos, pruebas unitarias, build y recorridos de extremo a extremo. Comprobar manualmente controles, animación, curva, detector y disposición móvil cuando los cambios lo requieran. Registrar resultados reales en un reporte. Los fallos impiden la promoción.
3. Las correcciones se realizan en `develop` y vuelven a pasar por `qa`. No corregir silenciosamente sólo `main` o `production`.
4. Con QA satisfactoria, incorporar `qa` a `main`. Conservar la ascendencia mediante avances rápidos o commits de merge; no usar squash ni rebase al promover estas ramas permanentes.
5. Para publicar, incorporar `main` a `production`. Si es posible, usar avance rápido para que coincidan los commits. El workflow vuelve a comprobar el commit de `production` y publica el artefacto de esa misma ejecución. Un PR puede utilizarse para incorporar cambios; no implica un requisito de revisión de código.
6. Esperar el resultado de `build` y `deploy`, abrir la web y registrar el commit, URL y resultado. Durante una ejecución pendiente o fallida, GitHub Pages puede seguir sirviendo la publicación anterior: el puntero de la rama no demuestra que el sitio ya esté actualizado.

La inicialización del esquema alinea las cuatro ramas en la versión integrada actual más la configuración de este flujo. A partir de ese punto, no se sincronizan automáticamente: cada promoción es una decisión de producción.

## Controles y publicación

`AstroDetect checks` se ejecuta en pushes y PR dirigidos a las cuatro ramas. `Publish AstroDetect Pages` se ejecuta en cada push a `production` o manualmente seleccionando esa misma rama; en otra rama no construye ni publica. Se mantiene la comprobación T402 DONE y las pruebas previas al artefacto. La antigua variable `PAGES_AUTO_DEPLOY` ya no interviene.

GitHub Pages debe seguir configurado con GitHub Actions como fuente. Si el entorno `github-pages` tiene restricciones de ramas, la persona administradora debe autorizar `production` antes de publicar; no se eluden reglas ni se cambian permisos para sortear un bloqueo. No se añaden revisores obligatorios.

Este cambio configura workflows y un protocolo de trabajo. No crea reglas administrativas de protección de ramas ni impide por permisos que un colaborador cree otra rama. Los agentes y compañeros deben respetar la política; no se declara una protección que no esté configurada y comprobada.

## Historial y recuperación

El [inventario original](ramas-archivo.json) registra las 22 ramas retiradas, sus SHAs y si estaban integradas en el `main` de partida, `1d1cac9500ddc507613eba8691d7bb51ee9318d7`. Las seis puntas de auditoría o revisión no integradas se conservan con etiquetas `archive/2026-10-28/…`. Las otras puntas siguen siendo alcanzables desde el historial de `main`. Eliminar sus nombres de rama no elimina los commits ni los PR históricos.

Además se generó y verificó un respaldo Git completo `ramas-1d1cac9.bundle` fuera del repositorio. Su SHA-256 es `9CF1DE0FFD3C2EBF4FABA7FCC92B2AB6617877FF4CF649F626ABFE2C1862766B`. Producción conserva ese respaldo junto con el inventario. No se borran copias locales ni archivos de los compañeros. En clones existentes, `git fetch --prune origin` actualiza las referencias remotas sin borrar las ramas locales ni su trabajo.

Ante una regresión pública, realizar una corrección o reversión mediante un commit nuevo en `develop` y promoverlo por QA, main y production. No reescribir el historial ni retroceder ramas mediante force push.

## Referencias

- [Workflows de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- [Entornos y restricciones de despliegue](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

Consultadas el 28 de octubre de 2026.
