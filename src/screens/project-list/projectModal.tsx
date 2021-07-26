import styled from "@emotion/styled";
import { Button, Drawer, Form, Input, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { ErrorBox } from "components/lib";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useAddProject, useEditProject } from "utils/project";
import { useProjectModal } from "./utils";

export const ProjectModal = () => {
  const { projectModalOpen, close, editingProject, isLoading } =
    useProjectModal();
  const useMutateProject = editingProject ? useEditProject : useAddProject;

  const { mutateAsync, error, isLoading: mutateLoading } = useMutateProject();
  const [form] = useForm(); // antd提供了hook，用于与Form双向绑定
  const onFinish = (values: any) => {
    // 与Form的onFinish接口的类型要求一致
    mutateAsync({ ...editingProject, ...values }).then(() => {
      // 用values中新的值覆盖老的值
      form.resetFields(); // 提交后重置表单
      close();
    });
  };

  const title = editingProject ? "编辑项目" : "创建项目"; // 如果是undefined，则是创建项目

  useEffect(() => {
    form.setFieldsValue(editingProject);
  }, [editingProject, form]);

  return (
    <Drawer
      forceRender={true}
      visible={projectModalOpen}
      width="100%"
      onClose={close}
    >
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <Container>
          <h1>{title}</h1>
          <ErrorBox error={error} />
          {/* Input的value被Form代理了，不用设置value和onChange */}
          <Form
            form={form}
            layout="vertical"
            style={{ width: "40rem" }}
            onFinish={onFinish}
          >
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: "请输入项目名" }]}
            >
              <Input placeholder="请输入项目名称" />
            </Form.Item>
            <Form.Item
              label="部门"
              name="organization"
              rules={[{ required: true, message: "请输入部门名" }]}
            >
              <Input placeholder="请输入部门名" />
            </Form.Item>
            <Form.Item label="负责人" name="personId">
              <UserSelect defaultOptionName="负责人" />
            </Form.Item>
            <Form.Item>
              <Button loading={mutateLoading} type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Container>
      )}
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
