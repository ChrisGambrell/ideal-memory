import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TASKS = ["First task!", "Second task!", "Third task!"];

async function main() {
  await Promise.all(
    TASKS.map((body) => prisma.task.create({ data: { body } }))
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
