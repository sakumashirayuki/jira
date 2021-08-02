import { Kanban } from "types/Kanban";
import { useTaskTypes } from "utils/task-type";
import { useTasksSearchParams } from "./utils";

import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Card } from "antd";
import { useTasks } from "utils/task";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) return null;
  return <img src={name === "task" ? taskIcon : bugIcon} alt="task type" />;
};

export const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTasks(useTasksSearchParams()[0]);
  const tasks = allTasks?.filter((item) => item.kanbanId === kanban.id);
  return (
    <Container>
      <h3>{kanban.name}</h3>
      <TasksContainer>
        {tasks?.map((task) => (
          <Card key={task.id} style={{ marginBottom: "0.5rem" }}>
            <div>{task.name}</div>
            <TaskTypeIcon id={task.typeId} />
          </Card>
        ))}
      </TasksContainer>
    </Container>
  );
};

const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1; // 代表均匀分配元素
  ::-webkit-scrollbar {
    // pseudo tag
    display: none;
  }
`;
