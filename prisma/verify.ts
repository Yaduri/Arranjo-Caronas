import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const participants = await prisma.participant.findMany();
  console.log("Participants names:", participants.map(p => p.name));
  console.log("Count:", participants.length);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
