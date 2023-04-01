import { PrismaClient, type Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const mock_tasks: Prisma.TaskCreateInput[] = [
  { body: "First task!", completed: false },
  { body: "Second task!", completed: true },
  { body: "Third task!", completed: false },
];

async function main() {
  await prisma.task.deleteMany({});

  await Promise.all(mock_tasks.map((data) => prisma.task.create({ data })));
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
