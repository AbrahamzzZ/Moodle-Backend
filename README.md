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

# Creación de tokens en el Moodle

Debe crearse un token de Web Service en Moodle.
El mismo token puede utilizarse para los tres tipos de usuarios:

   - Administrador

   - Docente

   - Estudiante

Este token permitirá al backend consumir los servicios REST de Moodle.

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

Cree un archivo .env en la raíz del proyecto y configure las siguientes variables:

    DATABASE_URL="file:./notifications.db"
    MOODLE_URL=xxxxxxx
    MOODLE_API_TOKEN=xxxxxxxx
    JWT_SECRET=xxxxxxx
    JWT_EXPIRES=xxxxxxx

# Ejecutar el servidor

Para iniciar el backend en modo desarrollo, ejecute:

- npm run dev

El servidor se levantará en: http://localhost:3000