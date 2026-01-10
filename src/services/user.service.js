import prisma from '../prismaClient.js';

export async function findByEmail(email) {
  return prisma.usuario.findUnique({
    where: { email }
  });
}

export async function createUser(data) {
  return prisma.usuario.create({
    data
  });
}
