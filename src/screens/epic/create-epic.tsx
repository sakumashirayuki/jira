import styled from "@emotion/styled";
import { Button, Drawer, DrawerProps, Form, Input, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ErrorBox } from "components/lib";
import { useEffect } from "react";
import { useProjectInUrl } from "screens/kanban/utils";
import { useAddEpic } from "utils/epic";
import { useEpicQueryKey } from "./utils";

// 我们要求外层组件给CreateEpic传入'visible'和'onClose'参数
export const CreateEpic = (
  props: Pick<DrawerProps, "visible"> & { onClose: () => void }
) => {
  const {
    isLoading,
    error,
    mutateAsync: addEpic,
  } = useAddEpic(useEpicQueryKey());
  const [form] = useForm(); // antd提供了hook，用于与Form双向绑定
  const { data: currentProject } = useProjectInUrl();

  const onFinish = async (values: any) => {
    // 与Form的onFinish接口的类型要求一致
    await addEpic({ ...values, projectId: currentProject?.id });
    props.onClose();
  };

  useEffect(() => {
    form.resetFields();
  }, [form, props.visible]); // 当form或者props.visible变化时，将表单重置

  return (
    <Drawer
      forceRender={true}
      visible={props.visible}
      width="100%"
      onClose={props.onClose}
      destroyOnClose={true}
    >
      <Container>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <h1>创建任务组</h1>
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
                rules={[{ required: true, message: "请输入任务组名" }]}
              >
                <Input placeholder="请输入任务组名称" />
              </Form.Item>
              <Form.Item style={{ textAlign: "right" }}>
                <Button loading={isLoading} type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Container>
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
