import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const drivers = ["Andre", "Rodrigo", "Gultiere", "Osmar"];
  const passengers = ["Vilma", "Matilde"];

  console.log("Seeding participants...");

  for (const name of drivers) {
    const exists = await prisma.participant.findFirst({ where: { name, role: "DRIVER" } });
    if (!exists) {
      await prisma.participant.create({ data: { name, role: "DRIVER" } });
    }
  }

  for (const name of passengers) {
    const exists = await prisma.participant.findFirst({ where: { name, role: "PASSENGER" } });
    if (!exists) {
      await prisma.participant.create({ data: { name, role: "PASSENGER" } });
    }
  }

  console.log("Participants seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
