# Moodle Backend API

Backend desarrollado en Node.js + Express para la integración con Moodle, autenticación con Google y consumo de servicios REST.

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

# Variables de entorno

Cree un archivo .env en la raíz del proyecto y configure las siguientes variables:

    MOODLE_URL=xxxxxxx
    MOODLE_TOKEN=xxxxxxxx
    JWT_SECRET=xxxxxxx
    JWT_EXPIRES=xxxxxxx

# Ejecutar el servidor

Para iniciar el backend en modo desarrollo, ejecute:

- npm run dev

El servidor se levantará en: http://localhost:3000