const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Models available in prisma:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
  try {
    const configs = await prisma.configuration.findMany();
    console.log('Configurations:', configs);
  } catch (e) {
    console.error('Error fetching configurations:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
