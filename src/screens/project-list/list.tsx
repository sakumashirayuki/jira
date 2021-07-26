import { Dropdown, Menu, Table } from "antd";
import { TableProps } from "antd/es/table";
import { ButtonNoPadding } from "components/lib";
import { Pin } from "components/pin";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useEditProject } from "utils/project";
import { projectListActions } from "./project-list.slice";
import { User } from "./search-panel";

export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number; // created time
}

interface ListProps extends TableProps<Project> {
  // ListProps包含了Table上所有属性的集合
  users: User[];
  refresh?: () => void;
}

export const List = ({ users, ...props }: ListProps) => {
  const dispatch = useDispatch();
  const { mutate } = useEditProject();
  //柯里化
  const pinProject = (id: number) => (pin: boolean) =>
    mutate({ id, pin }).then(props.refresh);
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
            return (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="edit">
                      <ButtonNoPadding
                        type="link"
                        onClick={() =>
                          dispatch(projectListActions.openProjectModal())
                        }
                      >
                        编辑
                      </ButtonNoPadding>
                    </Menu.Item>
                  </Menu>
                }
              >
                <ButtonNoPadding type="link">...</ButtonNoPadding>
              </Dropdown>
            );
          },
        },
      ]}
      {...props}
    ></Table>
  );
};
