import { PrismaClient } from '@prisma/client';

/** Cliente único de Prisma (SQLite: tokens push, tokens de Moodle, estado de foros). */
const prisma = new PrismaClient();

export default prisma;
