import { PrismaClient, BodyType } from '@prisma/client';

const prisma = new PrismaClient();

const modelsByBrand: Record<string, string[]> = {
  Toyota: ['Corolla', 'Camry', 'RAV4'],
  Honda: ['Civic', 'Accord', 'CR-V'],
  Ford: ['Focus', 'Mustang', 'Explorer'],
  BMW: ['3 Series', 'X5', '5 Series'],
  Audi: ['A4', 'Q5', 'A6'],
  Kia: ['Sportage', 'Sorento', 'Rio'],
  Hyundai: ['Elantra', 'Tucson', 'Santa Fe'],
  Mazda: ['Mazda3', 'CX-5', 'Mazda6'],
};
const brands = Object.keys(modelsByBrand);
const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray'];
const bodyTypes = Object.values(BodyType);

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  await prisma.car.deleteMany();

  const rows = Array.from({ length: 60 }).map(() => {
    const brand = rand(brands);
    return {
      brand,
      model: rand(modelsByBrand[brand]),
      year: 2010 + Math.floor(Math.random() * 15),
      price: Math.round((8000 + Math.random() * 60000) * 100) / 100,
      mileage: Math.floor(Math.random() * 200000),
      color: rand(colors),
      bodyType: rand(bodyTypes),
    };
  });

  await prisma.car.createMany({ data: rows });
  console.log(`Seeded ${rows.length} cars`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
