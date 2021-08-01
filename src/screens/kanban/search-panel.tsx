import { Button, Input } from "antd";
import { Row } from "components/lib";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useTasksSearchParams } from "./utils";

export const SearchPanel = () => {
  const [tasksParam, setParam] = useTasksSearchParams();
  const reset = () => {
    setParam({
      typeId: undefined,
      processorId: undefined,
      tagId: undefined,
      name: undefined,
    });
  };
  return (
    <Row marginBottom={4} gap={true}>
      <Input
        style={{ width: "20rem" }}
        type="text"
        value={tasksParam.name}
        placeholder="任务名"
        onChange={(evt) => setParam({ name: evt.target.value })}
      />
      <UserSelect
        value={tasksParam.processorId}
        onChange={(value) => setParam({ processorId: value })}
        defaultOptionName="经办人"
      />
      <TaskTypeSelect
        defaultOptionName="类型"
        value={tasksParam.typeId}
        onChange={(value) => setParam({ typeId: value })}
      />
      <Button onClick={reset}>清除筛选器</Button>
    </Row>
  );
};
