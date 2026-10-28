# Instrucciones del repositorio

Lee `AstroDetect/AGENTS.md`, `AstroDetect/docs/colaboracion.md` y `AstroDetect/docs/ramas.md` antes de modificar el proyecto.

Existen únicamente cuatro ramas permanentes: `develop`, `qa`, `main` y `production`. Trabaja en `develop` con una asignación explícita y archivos delimitados. No crees ramas `task/*`, `review/*`, `audit/*` ni otras ramas remotas.

Producción coordina las promociones `develop → qa → main → production`. Sólo `production` publica el sitio. No realices promociones, despliegues, eliminación de referencias ni cambios de configuración sin una asignación expresa. No se exige revisión cruzada ni auditoría de Claude; sí las verificaciones de la entrega y de QA.

La aplicación está en `AstroDetect/`. Conserva reportes e historial. Los documentos históricos pueden mencionar ramas retiradas; no son instrucciones para recrearlas.
