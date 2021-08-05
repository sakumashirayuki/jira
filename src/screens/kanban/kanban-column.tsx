import { Kanban } from "types/Kanban";
import { useTaskTypes } from "utils/task-type";
import { useKanbanQueryKey, useTaskModal, useTasksSearchParams } from "./utils";

import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { useTasks } from "utils/task";
import { CreateTask } from "./create-task";
import { Task } from "types/Task";
import { Mark } from "components/mark";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import React from "react";
import { Drag, Drop, DropChild } from "components/drag-and-drop";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) return null;
  return <img src={name === "task" ? taskIcon : bugIcon} alt="task type" />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTaskModal();
  const { name: keyword } = useTasksSearchParams()[0];
  return (
    <Card
      key={task.id}
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
      onClick={() => startEdit(task.id)}
    >
      <p>
        <Mark name={task.name} keyword={keyword} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbanQueryKey());

  const startDelete = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除看板吗？",
      onOk() {
        mutateAsync({ id: kanban.id });
      },
    });
  };

  const overlay = (
    <Menu>
      <Menu.Item>
        <Button onClick={startDelete} type="link">
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={overlay}>
      <Button type="link">...</Button>
    </Dropdown>
  );
};
// KanbanColumn需要定义为能够转发ref
export const KanbanColumn = React.forwardRef<
  HTMLDivElement,
  { kanban: Kanban }
>(({ kanban, ...props }, ref) => {
  const { data: allTasks } = useTasks(useTasksSearchParams()[0]); // 参数为projectId,这里获取的为当前project的所有task
  const tasks = allTasks?.filter((item) => item.kanbanId === kanban.id);
  return (
    // 将剩下的props传给Container
    <Container ref={ref} {...props}>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} key={kanban.id} />
      </Row>
      <TasksContainer>
        <Drop type="ROW" direction="vertical" droppableId={String(kanban.id)}>
          <DropChild>
            {tasks?.map((task, index) => (
              <Drag key={task.id} index={index} draggableId={"task" + task.id}>
                <div>
                  <TaskCard task={task} key={task.id} />
                </div>
              </Drag>
            ))}
          </DropChild>
        </Drop>
        <CreateTask kanbanId={kanban.id} />
      </TasksContainer>
    </Container>
  );
});

export const Container = styled.div`
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
