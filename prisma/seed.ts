import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const mock_tasks = ["first task!", "second task!", "third task!"];

async function main() {
  await prisma.user.deleteMany({});
  await prisma.status.deleteMany({});

  const incompleteStatus = await prisma.status.create({ data: { label: "Incomplete", order: 0 } });
  await prisma.status.create({ data: { label: "Complete", order: 1 } });

  const password = await bcrypt.hash("Passw0rd!", 10);
  const user1 = await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password,
      image: "https://api.dicebear.com/6.x/initials/svg?seed=JO",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password,
      image: "https://api.dicebear.com/6.x/initials/svg?seed=JA",
    },
  });

  await Promise.all(
    mock_tasks.map((body) =>
      prisma.task.create({ data: { body: `${user1.firstName}'s ${body}`, statusId: incompleteStatus.id, authorId: user1.id } })
    )
  );
  await Promise.all(
    mock_tasks.map((body) =>
      prisma.task.create({ data: { body: `${user2.firstName}'s ${body}`, statusId: incompleteStatus.id, authorId: user2.id } })
    )
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
