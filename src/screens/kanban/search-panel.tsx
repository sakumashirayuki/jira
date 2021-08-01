import { Form, Input } from "antd";
import { Row } from "components/lib";
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
    <Row marginBottom={10} gap={true}>
      <Form layout={"inline"} style={{ marginBottom: "2rem" }}>
        <Form.Item>
          <Input
            style={{ width: "20rem" }}
            type="text"
            value={tasksParam.name}
            placeholder="任务名"
            onChange={(evt) => setParam({ name: evt.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <UserSelect
            value={tasksParam.processorId}
            onChange={(value) => setParam({ processorId: value })}
            defaultOptionName="经办人"
          />
        </Form.Item>
      </Form>
    </Row>
  );
};
