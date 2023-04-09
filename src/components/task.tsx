import { ActionIcon, Group, Select, Text } from "@mantine/core";
import { type Task } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { api } from "~/utils/api";

export default function Task({ task }: { task: Task }) {
  const ctx = api.useContext();
  const { data: statuses = [] } = api.status.getAll.useQuery();
  const { mutateAsync: createStatus } = api.status.create.useMutation({ onSuccess: () => ctx.status.invalidate() });
  const { mutate: updateTask } = api.tasks.updateById.useMutation({ onSuccess: () => ctx.tasks.invalidate() });
  const { mutate: deleteTask, isLoading: loadingDeleteTask } = api.tasks.deleteById.useMutation({
    onSuccess: () => ctx.tasks.invalidate(),
  });

  const handleUpdateTask = (statusId: string) => updateTask({ id: task.id, data: { statusId } });
  const handleCreateStatus = async (label: string) => {
    const status = await createStatus({ label });
    handleUpdateTask(status.id);
  };

  return (
    <tr key={task.id}>
      <td>
        <Text>{task.body}</Text>
      </td>
      <td>
        <Select
          creatable
          data={statuses.map((s) => ({ label: s.label, value: s.id }))}
          searchable
          value={task.statusId}
          variant="unstyled"
          onChange={handleUpdateTask}
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={handleCreateStatus}
        />
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon color="red" loading={loadingDeleteTask} onClick={() => deleteTask({ id: task.id })}>
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  );
}
