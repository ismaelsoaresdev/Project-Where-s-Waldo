const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  
  await prisma  .target.deleteMany();

  console.log('Seeding targets...');

  await prisma.target.createMany({
    data: [
      {
        name: 'Hoop rolling',
        minX: 0.50,
        maxX: 0.56,
        minY: 0.83,
        maxY: 0.89,
      },
      {
        name: 'Children on stilts',
        minX: 0.63,
        maxX: 0.69,
        minY: 0.31,
        maxY: 0.37,
      },
      {
        name: 'Boy on barrel',
        minX: 0.65,
        maxX: 0.71,
        minY: 0.74,
        maxY: 0.85,
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });