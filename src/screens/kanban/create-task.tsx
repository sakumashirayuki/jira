import { Card, Input } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useAddTask } from "utils/task";
import { useProjectIdInUrl, useTasksQueryKey } from "./utils";

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey());
  const [inputMode, setInputMode] = useState(false);

  const submit = async () => {
    await addTask({ name, projectId, kanbanId });
    setInputMode(false);
    setName("");
  };

  const toggle = () => {
    setInputMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (!inputMode) {
      setName(""); // 如果为非输入状态，重置name
    }
  }, [inputMode]);

  if (!inputMode) {
    // 非输入状态
    return <div onClick={toggle}>+创建事务</div>;
  }
  return (
    <Card>
      <Input
        onBlur={toggle}
        autoFocus={true} //保证为输入状态时自动focus输入框
        placeholder="新建事务"
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Card>
  );
};
