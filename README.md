# Moodle Backend API

Backend desarrollado en Node.js + Express para la integración con Moodle, autenticación con Google y consumo de servicios REST.
Incluye persistencia con SQLite + Prisma para almacenar tokens de notificaciones push.

# Requisitos previos

Antes de clonar y ejecutar el proyecto, asegúrese de tener instalado:

 - Git

 - Node.js (versión recomendada: 18.x o superior)

 - npm (incluido con Node.js)

# Clonar el repositorio

Abra una terminal y ejecute:

- git clone https://github.com/AbrahamzzZ/Moodle-Backend.git

# Instalación de dependencias

Ejecute el siguiente comando para instalar las dependencias necesarias:

- npm install

# Moodle local con Docker (recomendado, reemplaza a XAMPP)

No hace falta instalar XAMPP ni Moodle: solo Docker Desktop.

1. Levantar Moodle (la primera vez descarga e instala Moodle 4.5, tarda varios minutos):

   - docker compose up -d --build

2. Ver el token generado automáticamente:

   - docker compose logs moodle | grep MOODLE_

   El contenedor ya activa los servicios web, el protocolo REST, crea el servicio externo
   "Moodle App Backend" con todas las funciones necesarias y genera un token para el admin.
   Copie `MOODLE_URL` y `MOODLE_TOKEN` al `.env` (ver `.env.example`).

3. Entrar a Moodle en http://localhost:8080 (usuario `admin`, contraseña `Admin123!`) y crear
   los cursos y usuarios. El correo de cada usuario debe ser el mismo de su cuenta de Google,
   porque el login busca al usuario en Moodle por email.

Desde el celular se accede con la IP del PC: http://<IP-del-PC>:8080.

Comandos útiles:

   - docker compose stop                 (apagar, los datos se conservan)
   - docker compose start                (volver a encender)
   - docker compose exec -u www-data moodle php /opt/moodle-setup/setup_webservices.php   (reconfigurar servicios y mostrar token)
   - docker compose down -v              (BORRA Moodle y su base de datos para empezar de cero)

Si prefiere configurar Moodle a mano (XAMPP u otro servidor), siga las secciones siguientes.

# Creación de tokens en el Moodle

Debe crearse un token de Web Service en Moodle.
El mismo token puede utilizarse para los tres tipos de usuarios:

   - Administrador

   - Docente

   - Estudiante

Este token permitirá al backend consumir los servicios REST de Moodle.

# Plugin local_moodleapp (respuestas y entregas a nombre del usuario)

Las respuestas a foros y las entregas de tareas se envían a Moodle con el token del propio
usuario, para que aparezcan a su nombre y no a nombre del admin. Como el login es con Google
(no hay contraseña de Moodle), el backend obtiene ese token con el plugin
`moodle-plugin/local/moodleapp`, que solo puede usar el admin. El token se guarda en la base
local (tabla `UserMoodleToken`).

Con Docker se instala solo. En una instalación manual de Moodle:

1. Copiar `moodle-plugin/local/moodleapp` a `<moodle>/local/moodleapp` y completar la
   instalación desde Administración del sitio > Notificaciones.
2. El servicio externo debe tener el nombre corto `moodle_app_backend`, con
   "Puede descargar archivos" y "Puede subir archivos" activados, y la función
   `local_moodleapp_get_user_token` agregada.
3. Dar la capacidad `webservice/rest:use` al rol "Usuario autenticado".

# Funciones y Capacidades del servicio web de Moodle

Se debe tener estas funciones para que la aplicacion funcione:

- core_course_create_courses
- core_course_get_contents
- core_course_get_courses
- core_course_get_enrolled_courses_by_timeline_classification
- core_enrol_get_users_courses
- core_enrol_get_enrolled_users
- core_user_get_users
- core_user_get_users_by_field
- mod_assign_get_assignments
- mod_assign_save_submission
- mod_forum_add_discussion
- mod_forum_add_discussion_post
- mod_forum_get_discussion_posts
- mod_forum_get_forums_by_courses
- mod_forum_get_forum_discussions
- mod_forum_get_forums_by_courses
- mod_forum_get_forum_discussions
- mod_forum_get_discussion_posts
- mod_assign_get_assignments
- mod_assign_get_submission_status
- mod_assign_save_submission
- mod_assign_submit_for_grading
- core_files_upload
- mod_assign_save_submission

Se debe tener estas capacidades para que la aplicación funcione:

- moodle/webservice:createtoken
- moodle/user:viewalldetails
- moodle/course:enrolreview
- moodle/course:view
- moodle/course:viewparticipants
- moodle/user:viewdetails
- webservice/rest:use
- mod/forum:replypost
- mod/forum:startdiscussion
- moodle/site:trustcontent

# Base de datos (SQLite + Prisma)

Este proyecto utiliza SQLite junto con Prisma ORM para almacenar información local, como los tokens de notificaciones push. 

1. Instalar Prisma. Si ya lo tienes instalado continuar con el paso 2.
- npm install prisma@6 --save-dev

2. Inicializar la base de datos:
- npx prisma generate version 6

3. Crear la base de datos y aplicar migraciones:
- npx prisma migrate dev

4. El archivo de base de datos se creará automáticamente en:
- prisma/notifications.db

Generar el cliente de Prisma:

# Variables de entorno

Copie `.env.example` a `.env` y complete los valores. Si falta una variable obligatoria,
el servidor no arranca y dice cuál es.

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Base SQLite local, p. ej. `"file:./notifications.db"` |
| `MOODLE_URL` | Sí | Endpoint REST: `http://<host>/webservice/rest/server.php` |
| `MOODLE_TOKEN` | Sí | Token del admin para el servicio externo |
| `JWT_SECRET` | Sí | Secreto para firmar los JWT de la app |
| `JWT_EXPIRES` | No | Duración del JWT (por defecto `1d`) |
| `PORT` | No | Puerto del servidor (por defecto `3000`) |
| `FORUM_REMINDER_CRON` | No | Frecuencia del job de recordatorios (por defecto `*/5 * * * *`) |
| `FORUM_REMINDER_WINDOW_MINUTES` | No | Minutos antes del cierre del foro en que se avisa (por defecto 1440 = 24 h) |

# Ejecutar el servidor

- `npm run dev` (desarrollo, se reinicia al guardar)
- `npm start` (producción)

El servidor se levanta en http://localhost:3000 (`GET /health` responde `{ ok: true }`).

# Arquitectura

El código está organizado **por módulos** (uno por funcionalidad) sobre unas pocas capas compartidas:

    src/
      server.js            Arranca el servidor HTTP y los jobs
      app.js               Express: middlewares, /api, 404 y manejador de errores
      routes.js            Monta las rutas de todos los módulos bajo /api
      config/env.js        Lee y valida el .env (único lugar que usa process.env)
      lib/                 Utilidades sin dependencias de Moodle
        errors.js          AppError (con código HTTP) y MoodleError
        validate.js        toId, toIdList, requireFields
        jwt.js             Firma/verificación del JWT de la app
        prisma.js          Cliente de la base SQLite
      middleware/
        auth.js            requireAuth: exige el JWT y deja req.user
        upload.js          multer: documentos (tareas) e imágenes (perfil)
        errorHandler.js    404 en JSON y manejo central de errores
      moodle/              Integración con Moodle
        client.js          callMoodle(token, función, params)
        tokens.js          ADMIN_TOKEN y withUserToken (token de cada usuario)
        files.js           Subida a borrador, validación y descarga de archivos
      modules/             Una carpeta por funcionalidad
        auth/ courses/ activities/ forum/ tasks/ resources/ profile/ grades/ notifications/
      jobs/
        index.js           Programa los jobs (cron)
        forumReminder.job.js  Push a estudiantes que no participaron en un foro que está por cerrar

Cada módulo tiene tres archivos:

| Archivo | Responsabilidad |
|---|---|
| `<módulo>.routes.js` | Rutas HTTP y sus middlewares (`requireAuth`, subida de archivos). |
| `<módulo>.controller.js` | Lee y valida la petición, llama al servicio y responde `{ ok: true, ... }`. Sin `try/catch`: los errores van al manejador central. |
| `<módulo>.service.js` | Lógica y llamadas a Moodle/Prisma. No conoce `req` ni `res`, por eso los jobs pueden reutilizarlo. |

Reglas:

- **Errores:** lanzar `badRequest()`, `notFound()`, `forbidden()`... (`lib/errors.js`). El manejador
  central responde `{ ok: false, message }` con el código correcto. Los errores de Moodle se traducen
  solos: curso inexistente → 404, sin permisos o no matriculado → 403.
- **Tokens de Moodle:** lo que el usuario consulta o hace va con **su** token (`withUserToken`): Moodle
  aplica sus permisos y las acciones quedan a su nombre. `ADMIN_TOKEN` solo para lo que exige admin
  (buscar usuarios por email, editar perfiles, ver participantes) y para los jobs.
- **Servicios reciben el token como parámetro**, así sirven tanto para un usuario como para un job.
- **Nuevo endpoint:** agregar la función al `service`, el handler al `controller`, la ruta al `routes`.
  Si es un módulo nuevo, montarlo en `src/routes.js`. Si usa una función nueva de Moodle, agregarla a
  `docker/moodle/setup_webservices.php`.

# Endpoints

Todos requieren `Authorization: Bearer <token de la app>` salvo el login. Responden `{ ok: true, ... }`
o, si hay error, `{ ok: false, message }`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login/google` | Login (header `Authorization: Bearer <idToken de Google>`). Devuelve `{ token, user }` |
| GET | `/api/auth/role/:courseId` | Rol del usuario en el curso: `estudiante`, `docente` u `otro` |
| GET | `/api/courses` | Cursos del usuario con su docente |
| GET | `/api/courses/:id` | Secciones y módulos del curso |
| GET | `/api/courses/:courseId/resources` | Recursos del curso con sus archivos (`?sectionId=`, `?mimetype=`) |
| GET | `/api/files/download?fileUrl=` | Descarga un archivo de Moodle (solo del propio Moodle) |
| GET | `/api/activities?courseIds=1&courseIds=2` | Tareas y foros de esos cursos, con fechas |
| GET | `/api/activities/course/:courseId` | Tareas y foros de un curso |
| GET | `/api/activities/assignments?courseIds=` | Tareas de esos cursos |
| GET | `/api/activities/forums?courseIds=` | Foros de esos cursos |
| GET | `/api/tasks/:taskId?courseId=` | Detalle de la tarea, entrega del usuario y calificación |
| POST | `/api/tasks/submit-text` | `{ taskId, text }` |
| POST | `/api/tasks/submit-file` | multipart: `taskId`, `file` (PDF/DOC/DOCX, máx. 10 MB) |
| GET | `/api/forum/forums?courseIds=` | Foros de esos cursos |
| GET | `/api/forum/forums/:forumId/discussions` | Discusiones del foro |
| GET | `/api/forum/discussions/:discussionId/posts` | Mensajes de la discusión |
| POST | `/api/forum/forums/reply` | `{ postId, message, courseId }` |
| GET | `/api/profile` | Perfil actual desde Moodle |
| PUT | `/api/profile` | Edita `firstname`, `lastname`, `phone1`, `phone2`, `address`, `city`, `country` (ISO de 2 letras), `description`. El email no se puede cambiar. |
| PUT | `/api/profile/picture` | Cambia la foto (multipart, campo `picture`, JPG/PNG, máx. 5 MB) |
| DELETE | `/api/profile/picture` | Quita la foto |
| GET | `/api/grades` | Nota final de cada curso |
| GET | `/api/grades/courses/:courseId` | Notas por actividad del curso y total |
| POST | `/api/notifications/register` | `{ pushToken, platform }` (token de Expo) |

Los endpoints de perfil devuelven `{ ok, profile, token }`. El `token` es un JWT nuevo con los datos
actualizados: la app debe guardarlo en lugar del anterior (`updateToken(token)` del `AuthProvider`).
