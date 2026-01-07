-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "tokenMoodle" TEXT NOT NULL,
    "tokenOAuth" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "docente" TEXT NOT NULL,
    "resumen" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cursoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaEntrega" DATETIME,
    "estado" TEXT NOT NULL,
    CONSTRAINT "Actividad_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actividadId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "permiteArchivo" BOOLEAN NOT NULL,
    CONSTRAINT "Tarea_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "Actividad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntregaTarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tareaId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "archivoUrl" TEXT,
    "fechaEntrega" DATETIME NOT NULL,
    CONSTRAINT "EntregaTarea_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EntregaTarea_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Foro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cursoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    CONSTRAINT "Foro_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MensajeForo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "foroId" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MensajeForo_foroId_fkey" FOREIGN KEY ("foroId") REFERENCES "Foro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MensajeForo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tarea_actividadId_key" ON "Tarea"("actividadId");
