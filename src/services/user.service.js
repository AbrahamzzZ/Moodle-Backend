const prisma = require('../prismaClient');

async function findByEmail(email) {
  return prisma.usuario.findUnique({
    where: { email }
  });
}

async function createUser(data) {
  return prisma.usuario.create({
    data
  });
}

module.exports = {
  findByEmail,
  createUser
};