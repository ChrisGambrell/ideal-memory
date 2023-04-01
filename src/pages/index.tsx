import { createStyles } from "@mantine/core";
import Head from "next/head";
import { api } from "~/utils/api";

const useStyles = createStyles({
  completed: {
    textDecoration: "line-through",
  },
});

export default function Home() {
  const { classes, cx } = useStyles();

  const ctx = api.useContext();
  const { data: tasks = [], isLoading: loadingTasks } = api.tasks.getAll.useQuery();
  const { mutate: updateTask } = api.tasks.updateById.useMutation({
    onSuccess: () => ctx.tasks.invalidate(),
  });

  if (loadingTasks) return <div>Loading tasks...</div>;
  return (
    <>
      <Head>
        <title>Ideal Memory</title>
        <meta name="description" content="A task keeping application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={cx(task.completed && classes.completed)}
              onClick={() => updateTask({ id: task.id, data: { completed: !task.completed } })}
            >
              {task.body}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
