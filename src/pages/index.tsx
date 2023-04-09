import { Container, Stack, Table, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useState } from "react";
import { z } from "zod";
import Controls from "~/components/controls";
import Task from "~/components/task";
import UserControls from "~/components/user-controls";
import { verifyAuth } from "~/server/auth";
import { api } from "~/utils/api";

export default function Home() {
  const [completedFilter, setCompletedFilter] = useState<boolean | null>(null);
  const [taskFilter, setTaskFilter] = useState("");

  const form = useForm({ initialValues: { body: "" }, validate: zodResolver(z.object({ body: z.string().min(1) })) });

  const ctx = api.useContext();
  const { data: tasks = [], isLoading: loadingTasks } = api.tasks.getAll.useQuery();
  const { mutate: createTask, isLoading: loadingCreateTask } = api.tasks.create.useMutation({
    onSuccess: () => ctx.tasks.invalidate(),
    onError: (error) => form.setFieldError("body", error.message),
  });

  const filteredTasks = tasks.filter(({ body }) => body.toLowerCase().includes(taskFilter.toLowerCase()));

  const handleSubmit = (values: typeof form.values) => createTask(values);

  if (loadingTasks) return <div>Loading tasks...</div>;
  return (
    <Container mt={16} size="xs">
      <Stack spacing="xl">
        <UserControls />
        <Controls
          completedFilter={completedFilter}
          setCompletedFilter={setCompletedFilter}
          taskFilter={taskFilter}
          setTaskFilter={setTaskFilter}
        />
        <Table verticalSpacing="sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </tbody>
        </Table>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput disabled={loadingCreateTask} placeholder="New task..." {...form.getInputProps("body")} />
        </form>
      </Stack>
    </Container>
  );
}

export const getServerSideProps = verifyAuth;
