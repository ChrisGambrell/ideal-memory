import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const mock_tasks = [
  { body: "first task!", completed: false },
  { body: "second task!", completed: true },
  { body: "third task!", completed: false },
];

async function main() {
  await prisma.user.deleteMany({});

  const password = await bcrypt.hash("Passw0rd!", 10);
  const user1 = await prisma.user.create({
    data: { name: "John Doe", email: "john@example.com", password, image: "https://api.dicebear.com/6.x/initials/svg?seed=JO" },
  });
  const user2 = await prisma.user.create({
    data: { name: "Jane Doe", email: "jane@example.com", password, image: "https://api.dicebear.com/6.x/initials/svg?seed=JA" },
  });

  await Promise.all(
    mock_tasks.map((task) => prisma.task.create({ data: { ...task, body: `${user1.name} ${task.body}`, authorId: user1.id } }))
  );
  await Promise.all(
    mock_tasks.map((task) => prisma.task.create({ data: { ...task, body: `${user2.name} ${task.body}`, authorId: user2.id } }))
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
