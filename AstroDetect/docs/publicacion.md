# Publicación desde production

Política vigente desde el 28 de octubre de 2026. La aplicación ya cuenta con una publicación verificada; la evidencia original se conserva en `agents/evidence/T403/` y en el reporte `agents/reports/T403-PRODUCTOR-attempt-02.md`. Este documento sustituye la configuración inicial que publicaba desde main.

## Ubicación y flujo

El sitio es https://tbl4z3r.github.io/AstroDetect/. La aplicación sigue en `AstroDetect/` dentro del repositorio Git; Vite usa la base `/AstroDetect/` y genera `AstroDetect/dist`. Es un sitio estático: los cálculos se realizan en cada navegador.

La secuencia de promoción es develop → qa → main → production. Los cambios se desarrollan en develop, se prueban como candidata en qa y llegan a main como código terminado. Incorporar main a production inicia la publicación; ninguna otra rama publica. Lee el [protocolo completo](ramas.md).

## Workflow de publicación

`.github/workflows/deploy.yml` responde a cada push a production, incluso si sólo cambia documentación, y admite ejecución manual seleccionando esa rama. Tanto build como deploy comprueban `github.ref == 'refs/heads/production'`. Una ejecución manual en otra rama omite ambos trabajos. La antigua variable PAGES_AUTO_DEPLOY no interviene.

El checkout usa el SHA de la ejecución, sin conservar credenciales. Build tiene permiso de lectura y verifica T402 DONE, instala con npm ci, ejecuta lint, tipos, pruebas unitarias, build y pruebas de extremo a extremo en Chromium. Sólo después carga el artefacto de `AstroDetect/dist`. Deploy depende del build de esa misma ejecución; publica con el entorno github-pages y permisos pages: write e id-token: write. La concurrencia serializa las publicaciones.

GitHub Pages debe mantener GitHub Actions como fuente. configure-pages conserva enablement: false; no se crean tokens ni se amplían permisos. Si el entorno github-pages restringe las ramas permitidas, la persona administradora debe autorizar production. No se eluden esas restricciones ni se añaden revisores obligatorios.

## Comprobación de cada publicación

Esperar a que build y deploy terminen satisfactoriamente. Registrar SHA, URL del run, fecha y dirección efectiva. Después abrir el sitio, recargar y comprobar recursos, controles, curva y detector; comprobar móvil cuando corresponda. El SHA de la rama production no garantiza que el despliegue haya terminado: durante una ejecución pendiente o fallida puede seguir visible la versión anterior.

No se necesita cuenta de visitante ni servidor de cálculo. Las pruebas acotadas de la entrega no garantizan disponibilidad ilimitada ni compatibilidad con todos los dispositivos.

## Reversión

Un fallo anterior al despliegue deja la publicación anterior disponible. Ante una regresión ya publicada, crear un commit de corrección o reversión en develop y promoverlo por qa, main y production con sus pruebas. Registrar el cambio y comprobar la web. No reescribir historial ni usar force push.

## Fuentes

- [Workflows de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- [Entornos y restricciones de despliegue](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

Consultadas el 28 de octubre de 2026.
