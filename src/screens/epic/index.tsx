import { Button, List, Modal } from "antd";
import { Row, ScreenContainer } from "components/lib";
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjectInUrl } from "screens/kanban/utils";
import { useDocumentTitle } from "utils";
import { useDeleteEpic, useEpics } from "utils/epic";
import { useTasks } from "utils/task";
import { CreateEpic } from "./create-epic";
import { useEpicQueryKey, useEpicSearchParams } from "./utils";

export const EpicScreen = () => {
  useDocumentTitle("任务组列表", false);
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics(useEpicSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id }); //tasks先用projectId筛选，再用任务组筛选
  const { mutate: deleteEpic } = useDeleteEpic(useEpicQueryKey());

  const [epicCreateOpen, setEpicCreateOpen] = useState(false);

  const startDelete = (id: number) => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除看板吗？",
      onOk() {
        deleteEpic({ id });
      },
    });
  };

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>{currentProject?.name}任务组</h1>
        <Button onClick={() => setEpicCreateOpen(true)}>创建任务组</Button>
      </Row>
      <List
        // 为List设置可以滚动的属性
        style={{ overflow: "scroll" }}
        dataSource={epics}
        itemLayout="vertical"
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{epic.name}</span>
                  <Button type="link" onClick={() => startDelete(epic.id)}>
                    删除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>
                    开始时间：
                    <span>{dayjs(epic.start).format("YYYY-MM-DD")}</span>
                  </div>
                  <div>
                    结束时间：
                    <span>{dayjs(epic.end).format("YYYY-MM-DD")}</span>
                  </div>
                </div>
              }
            />
            <div>
              {/* 链接到看板的编辑页面 */}
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <Link
                    key={task.id}
                    to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                    style={{ display: "block" }}
                  >
                    {task.name}
                  </Link>
                ))}
            </div>
          </List.Item>
        )}
      />
      <CreateEpic
        visible={epicCreateOpen}
        onClose={() => setEpicCreateOpen(false)}
      />
    </ScreenContainer>
  );
};
