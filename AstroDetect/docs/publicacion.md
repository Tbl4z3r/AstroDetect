# Publicación gratuita de AstroDetect

Estado de esta entrega: configuración preparada; publicación y verificación pública pendientes. La preparación no declara T403 DONE. T402 debe finalizar antes de publicar el MVP.

## Diseño y ubicación

La aplicación conserva su ubicación `AstroDetect/` dentro del repositorio Git. El workflow vive en la raíz Git, `.github/workflows/deploy.yml`. Vite ya establece `base: '/AstroDetect/'` y produce `AstroDetect/dist`; no se modificó esa configuración. GitHub Pages admite sitios estáticos desde repositorios públicos en GitHub Free. No se necesita un servidor de simulación, cuenta de visitante, dominio de pago ni servicio externo de datos. [Documentación oficial de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

La dirección prevista es `https://tbl4z3r.github.io/AstroDetect/`. Se debe registrar la URL efectiva devuelta por el paso de despliegue; una dirección prevista no demuestra que el sitio exista. Cada navegador calcula su propia serie. El objetivo es diez usuarios independientes; no se declara capacidad medida ni disponibilidad ilimitada hasta registrar las pruebas pertinentes.

## Habilitación inicial por quien administra el repositorio

1. Confirmar que T402 figure DONE en el registro del commit que se desea publicar y que la aceptación tenga evidencia.
2. Una persona con permisos de administración abre `Tbl4z3r/AstroDetect` en GitHub, entra en **Settings → Pages → Build and deployment → Source**, elige **GitHub Actions** y guarda si la interfaz lo solicita.
3. Si Pages o Actions no están disponibles por permisos o políticas, informar el bloqueo exacto. No sustituir el paso por un token personal, no copiar credenciales ni ampliar permisos silenciosamente. La habilitación inicial queda a cargo de la persona que administra el repositorio.
4. Incorporar a main la configuración preparada y el registro actualizado por producción. En **Actions → Publish AstroDetect Pages → Run workflow**, seleccionar **main** y ejecutar manualmente la primera publicación.
5. Comprobar los jobs `build` y `deploy`, la URL del entorno `github-pages` y la página real antes de registrar una publicación satisfactoria.

`actions/configure-pages@v5` se usa con `enablement: false`. Lee la configuración existente; no pretende crear o habilitar Pages con el `GITHUB_TOKEN`. La acción oficial indica que habilitar Pages requiere otro tipo de token con permisos adicionales. Esta entrega no lo configura. [Definición oficial de configure-pages v5](https://github.com/actions/configure-pages/blob/v5/action.yml).

## Qué ejecuta el workflow

Sólo se procesa `main`; una ejecución manual sobre otra rama queda omitida. `checkout` fija `github.sha` y no conserva credenciales en el checkout. El job de construcción tiene únicamente lectura del contenido. Comprueba primero que T402 esté DONE y después usa Node 22.12.0, instalación reproducible `npm ci`, lint, comprobación de tipos, pruebas unitarias en una ejecución, compilación, instalación de Chromium de Playwright y pruebas de extremo a extremo.

El artefacto `github-pages` se carga desde `AstroDetect/dist` únicamente si todos los pasos anteriores terminan correctamente. El job `deploy` depende de ese `build` y publica su artefacto de la misma ejecución; no descarga un build de una rama o ejecución ajena. Sus permisos son `contents: read`, `pages: write` e `id-token: write`, y utiliza el entorno `github-pages`. No se ejecuta en eventos de pull request. El grupo de concurrencia serializa publicaciones sin cancelar una que ya esté en curso.

La secuencia repite los controles en la ejecución que crea el artefacto publicado aunque el workflow de CI también los ejecute. Así la publicación conserva la relación entre commit, verificaciones y contenido servido. Si un control falla, no se carga ni despliega un artefacto nuevo y la publicación anterior permanece.

Se utilizan referencias oficiales verificadas: `actions/checkout@v4`, `actions/setup-node@v4`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` y `actions/deploy-pages@v4`. Son referencias de versión oficiales, no SHAs inmutables. No se inventaron hashes de acciones. [Guía oficial de workflows de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [upload-pages-artifact v3](https://github.com/actions/upload-pages-artifact/blob/v3/action.yml) y [deploy-pages v4](https://github.com/actions/deploy-pages/blob/v4/action.yml).

## Actualizaciones posteriores

El evento `push` a main se limita a cambios bajo `AstroDetect/**` o al propio workflow. Con la configuración inicial, estos pushes ejecutan verificaciones y crean un artefacto, pero la publicación se inicia manualmente. Esto preserva la primera publicación manual de la ficha.

Después de verificar la primera publicación, producción puede mantener el modo manual o, con acceso autorizado, añadir la variable de repositorio **PAGES_AUTO_DEPLOY** con valor exacto **true** en **Settings → Secrets and variables → Actions → Variables → New repository variable**. Es una variable pública de control, no un secreto. Desde entonces los pushes relevantes a main publican automáticamente después de sus propios controles. Esta entrega no crea ni modifica esa variable. Si está ausente o tiene otro valor, los pushes no publican. No habilitarla antes de completar la primera publicación manual y la verificación requerida.

## Comprobación de la publicación

Producción debe guardar en un nuevo reporte o evidencia de T403 el commit completo publicado, URL del run, URL efectiva del sitio, fecha, navegador y resultados observados. El reporte de preparación permanece como historial.

- Abrir la URL HTTPS y verificar respuesta satisfactoria de la página y sus recursos bajo `/AstroDetect/`, sin errores de carga en la consola.
- Recargar esa misma dirección y abrirla desde un navegador de teléfono; registrar dispositivo o viewport y entorno. No confundir emulación con una prueba física.
- Usar controles, pausar, reiniciar, cambiar ruido y ejecutar el detector; comprobar mensajes y que el resultado pertenece a los datos vigentes.
- Abrir diez contextos de navegador independientes, con concurrencia acotada, y comprobar que cada uno carga e interactúa con su propia simulación. Registrar duración, fallos y alcance de la prueba. Esto no demuestra un acuerdo de disponibilidad ni cubre todos los dispositivos.
- Confirmar que no se exige cuenta, que no se recolectan datos académicos o personales por la aplicación y que el sitio comunica su propósito educativo y las simplificaciones.

Estas verificaciones son pendientes de ejecución pública. La preparación del workflow o un build local no las reemplazan.

## Reversión

Conservar el SHA de la última publicación comprobada y su evidencia. Si una actualización falla antes del despliegue, la última publicación sigue disponible. Si se descubre una regresión después, producción puede revertir el cambio problemático mediante un commit nuevo en main, conservando el historial, y ejecutar el workflow manualmente. Los controles deben volver a pasar sobre el commit que produce el nuevo artefacto. No volver a ejecutar ciegamente una publicación antigua que carezca de esta configuración o aceptación. Registrar SHA retirado, SHA que restituye el comportamiento, motivo, URL y resultado de la comprobación posterior.

## Fuentes primarias consultadas para esta preparación

- [Workflows de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- [checkout v4](https://github.com/actions/checkout/blob/v4/action.yml).
- [setup-node v4](https://github.com/actions/setup-node/blob/v4/action.yml).
- [configure-pages v5](https://github.com/actions/configure-pages/blob/v5/action.yml).
- [upload-pages-artifact v3](https://github.com/actions/upload-pages-artifact/blob/v3/action.yml).
- [deploy-pages v4](https://github.com/actions/deploy-pages/blob/v4/action.yml).

Consulta realizada el 26 de octubre de 2026. Las condiciones del servicio y las versiones pueden cambiar; comprobar sus fuentes si se modifica la configuración.
