# Incorporar el paquete a GitHub

Estado verificado: repositorio público vacío, rama predeterminada anunciada `main`, sin archivos. Las dos conexiones GitHub de esta sesión tienen `push: false`. No se intentó publicar usando permisos inexistentes. Git por terminal tampoco pudo conectarse durante la comprobación; el conector permitió verificar el estado remoto.

## Opción con interfaz GitHub

Desde una cuenta con escritura en Tbl4z3r/AstroDetect, incorporar el contenido de la carpeta AstroDetect a la raíz del repositorio, conservando subcarpetas y archivos ocultos, incluidos `.cursor/` y `.gitignore`. No subir el ZIP como sustituto de los archivos. Si la interfaz no conserva los archivos ocultos o toda la estructura, usar Git local o GitHub Desktop. Revisar el listado antes de confirmar el primer commit documental.

## Opción Git local

Con Git y autenticación de escritura ya configurados, clonar el repositorio vacío en una carpeta nueva. Copiar dentro el contenido de AstroDetect, sin crear una carpeta AstroDetect anidada y sin copiar ningún `.git` ajeno. Revisar `git status`, añadir sólo los archivos del paquete y crear el commit inicial `docs: preparar producción de AstroDetect`. Confirmar que la rama es main y subirla al remoto original.

Antes de cualquier operación, comprobar de nuevo el estado remoto: si otra persona ya agregó archivos, conservarlos e integrar mediante una rama y PR, sin sobrescribir ni forzar main. No pegar credenciales en instrucciones, archivos o reportes.

## Después de incorporar

Asignar T000. Aún no hay app, package.json ni workflow, por lo que no corresponde ejecutar npm ci o habilitar una demo como si estuviera construida. T000 crea la base reproducible y T403 prepara publicación una vez que el MVP haya superado sus verificaciones.

Una persona con permisos administrativos habilitará Settings → Pages → GitHub Actions cuando T403 esté lista. Registrar la URL y el commit publicados sólo después de verificar que existen. El dominio previsto no equivale a un despliegue efectuado.
