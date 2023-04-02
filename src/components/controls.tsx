import { ActionIcon, Menu, TextInput } from "@mantine/core";
import { IconFilter, IconSquareCheck, IconSquareOff } from "@tabler/icons-react";
import { type Dispatch, type SetStateAction } from "react";

export default function Controls({
  completedFilter,
  setCompletedFilter,
  taskFilter,
  setTaskFilter,
}: {
  completedFilter: boolean | null;
  setCompletedFilter: Dispatch<SetStateAction<boolean | null>>;
  taskFilter: string;
  setTaskFilter: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex items-center space-x-2">
      <TextInput className="flex-1" placeholder="Search for tasks..." value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)} />
      <Menu position="bottom-end" shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon className="flex-shrink-0" bg={completedFilter !== null ? "gray.1" : ""} size="lg" variant="default">
            <IconFilter size="1.125rem" />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            bg={completedFilter === true ? "gray.1" : ""}
            icon={<IconSquareCheck size={14} />}
            onClick={() => setCompletedFilter((p) => (p === true ? null : true))}
          >
            Show Completed
          </Menu.Item>
          <Menu.Item
            bg={completedFilter === false ? "gray.1" : ""}
            icon={<IconSquareOff size={14} />}
            onClick={() => setCompletedFilter((p) => (p === false ? null : false))}
          >
            Show Incomplete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
