import { ActionIcon, Checkbox, Container, Divider, Group, Stack } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Head from "next/head";
import { Fragment, type ChangeEvent } from "react";
import { api } from "~/utils/api";

export default function Home() {
  const ctx = api.useContext();
  const { data: tasks = [], isLoading: loadingTasks } = api.tasks.getAll.useQuery();
  const { mutate: updateTask } = api.tasks.updateById.useMutation({ onSuccess: () => ctx.tasks.invalidate() });
  const { mutate: deleteTask, isLoading: loadingDeleteTask } = api.tasks.deleteById.useMutation({
    onSuccess: () => ctx.tasks.invalidate(),
  });

  const toggleTask = (id: string) => (e: ChangeEvent<HTMLInputElement>) => updateTask({ id, data: { completed: e.target.checked } });

  if (loadingTasks) return <div>Loading tasks...</div>;
  return (
    <>
      <Head>
        <title>Ideal Memory</title>
        <meta name="description" content="A task keeping application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container mt={16} size="xs">
        <Stack spacing="xs">
          {tasks.map((task, i) => (
            <Fragment key={task.id}>
              <Group position="apart">
                <Checkbox key={task.id} label={task.body} checked={task.completed} onChange={toggleTask(task.id)} />
                <ActionIcon
                  color="red"
                  loading={loadingDeleteTask}
                  radius="xl"
                  size="sm"
                  variant="subtle"
                  onClick={() => deleteTask({ id: task.id })}
                >
                  <IconTrash size="0.875rem" />
                </ActionIcon>
              </Group>
              {i !== tasks.length - 1 && <Divider my={4} />}
            </Fragment>
          ))}
        </Stack>
      </Container>
    </>
  );
}
