import { Dropdown, Menu, Modal, Table } from "antd";
import { TableProps } from "antd/es/table";
import { ButtonNoPadding } from "components/lib";
import { Pin } from "components/pin";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Project } from "types/Project";
import { User } from "types/User";
import { useDeleteProject, useEditProject } from "utils/project";
import { useProjectModal, useProjectsQueryKey } from "./utils";

interface ListProps extends TableProps<Project> {
  // ListProps包含了Table上所有属性的集合
  users: User[];
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate: edit } = useEditProject(useProjectsQueryKey()); // 这个hook会暴露出一个mutate方法

  //柯里化
  const pinProject = (id: number) => (pin: boolean) => edit({ id, pin });

  return (
    <Table
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                // 这里如果写成()=>pinProject(project.id)，将无法捕捉到pin的值
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name), // 这里传入的a和b都是project
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          dataIndex: "created",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    ></Table>
  );
};

const More = ({ project }: { project: Project }) => {
  // 编辑功能使用的hook
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  // 删除功能一般有个confirm流程
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "确定删除这个项目吗？",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject({ id: id });
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="edit" onClick={editProject(project.id)}>
            编辑
          </Menu.Item>
          <Menu.Item
            key="delete"
            onClick={() => confirmDeleteProject(project.id)}
          >
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type="link">...</ButtonNoPadding>
    </Dropdown>
  );
};
