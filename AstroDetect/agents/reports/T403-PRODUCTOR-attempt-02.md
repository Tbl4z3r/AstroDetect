# T403 · publicación en GitHub Pages · intento 02

- Autor: PRODUCTOR, ejercido por Claude Code a petición de la usuaria del proyecto.
- Fecha: 27 de octubre de 2026.
- Intento anterior: [intento 01](T403-PRODUCTOR-attempt-01.md), preparación del workflow sin desplegar.
- Estado propuesto: DONE.

## Publicación

| Dato | Valor |
| --- | --- |
| Habilitación de Pages | Realizada por la administración del repositorio (Settings → Pages → Source: GitHub Actions), según informó la usuaria el 27 de octubre de 2026. |
| Commit publicado | `64a26999a39d949d1c3626cd931032831ac539ce` (merge del PR #13). |
| Ejecución | Workflow «Publish AstroDetect Pages», run `40432846997`, evento `workflow_dispatch` (primera publicación manual). Jobs `build` y `deploy` en success sobre el mismo SHA. |
| URL efectiva | https://tbl4z3r.github.io/AstroDetect/ |

El job `build` ejecuta en el mismo run los controles de instalación, lint, tipos, pruebas, build y e2e antes de subir `AstroDetect/dist`; `deploy` publica sólo ese artefacto.

## Verificación del sitio público

Playwright 1.64.1 con Chromium desde Windows 11, el 27 de octubre de 2026. Resultados en [verificacion-publicacion.json](../evidence/T403/verificacion-publicacion.json) y capturas `publicado-escritorio.png` y `publicado-movil-360.png` en `agents/evidence/T403/`.

- HTTPS: respuesta 200 en `https://`, con `Strict-Transport-Security`.
- Subruta: el HTML referencia `/AstroDetect/assets/…`; todas las peticiones fueron a `tbl4z3r.github.io`, sin respuestas de error ni errores de consola.
- Funcionamiento: «Buscar posibles tránsitos» con valores iniciales informa 5 eventos y período estimado de 5 días.
- Móvil: a 360 px no hay desplazamiento horizontal; la recarga funciona en escritorio y móvil.
- Diez sesiones independientes (contextos de navegador separados) en paralelo cargaron la página y completaron una búsqueda sin errores, entre 0,5 y 0,6 s cada una, 1,1 s en total. Volumen acotado; no mide la capacidad máxima ni promete disponibilidad ilimitada.

## Reversión

Revertir el cambio problemático en main con un commit nuevo y ejecutar de nuevo «Publish AstroDetect Pages» sobre main, según `docs/publicacion.md`. La publicación anterior permanece si un control falla. Para retirar el sitio, la administración puede desactivar Pages en Settings → Pages.

## Pendiente opcional

Decidir si mantener la publicación manual o crear la variable `PAGES_AUTO_DEPLOY=true` para publicar automáticamente tras cada push relevante a main. No se creó.
