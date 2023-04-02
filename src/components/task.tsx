import { ActionIcon, Checkbox, Group } from "@mantine/core";
import { type Task } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { type ChangeEvent } from "react";
import { api } from "~/utils/api";

export default function Task({ task }: { task: Task }) {
  const ctx = api.useContext();
  const { mutate: updateTask } = api.tasks.updateById.useMutation({ onSuccess: () => ctx.tasks.invalidate() });
  const { mutate: deleteTask, isLoading: loadingDeleteTask } = api.tasks.deleteById.useMutation({
    onSuccess: () => ctx.tasks.invalidate(),
  });

  const toggleTask = (id: string) => (e: ChangeEvent<HTMLInputElement>) => updateTask({ id, data: { completed: e.target.checked } });

  return (
    <Group position="apart">
      <Checkbox label={task.body} checked={task.completed} onChange={toggleTask(task.id)} />
      <ActionIcon color="red" loading={loadingDeleteTask} size="sm" variant="subtle" onClick={() => deleteTask({ id: task.id })}>
        <IconTrash size="0.875rem" />
      </ActionIcon>
    </Group>
  );
}
