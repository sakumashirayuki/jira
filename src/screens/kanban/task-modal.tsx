import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useDeleteTask, useEditTask } from "utils/task";
import { useTaskModal, useTasksQueryKey } from "./utils";

const layout = {
  labelCol: { span: 8 }, // 左边的文字
  wrapperCol: { span: 16 }, // 右边的表单
};

export const TaskModal = () => {
  const { close, editingTask, editingTaskId } = useTaskModal();
  const [form] = useForm();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  );
  const { mutate: deleteTask } = useDeleteTask(useTasksQueryKey());

  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() }).then(() => {
      form.resetFields();
      close();
    });
  };
  const onCancel = () => {
    form.resetFields();
    close();
  };

  const startDelete = () => {
    close();
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除任务吗？",
      onOk() {
        deleteTask({ id: Number(editingTaskId) });
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [editingTask, form]);

  return (
    <Modal
      okText="确认"
      cancelText="取消"
      confirmLoading={editLoading}
      title="编辑任务"
      visible={Boolean(editingTaskId)}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} initialValues={editingTask} {...layout}>
        <Form.Item
          label="任务名"
          name="name"
          rules={[{ required: true, message: "请输入任务名" }]}
        >
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        <Form.Item label="经办人" name="processorId">
          <UserSelect defaultOptionName="经办人" />
        </Form.Item>
        <Form.Item label="类型" name="typeId">
          <TaskTypeSelect />
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right" }}>
        <Button size="small" style={{ fontSize: "14px" }} onClick={startDelete}>
          删除
        </Button>
      </div>
    </Modal>
  );
};
