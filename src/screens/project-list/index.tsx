import styled from "@emotion/styled";
import { Button, Typography } from "antd";

import { SearchPanel } from "./search-panel";
import { List } from "./list";
import { useDebounce, useDocumentTitle } from "utils";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectsSearchParams } from "./utils";
import { ButtonNoPadding, Row } from "components/lib";
import { useDispatch } from "react-redux";
import { projectListActions } from "./project-list.slice";

export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);

  const dispatch = useDispatch();
  const [param, setParam] = useProjectsSearchParams();
  const debouncedParam = useDebounce(param, 200);
  const { isLoading, error, data: list, retry } = useProjects(debouncedParam);
  const { data: users } = useUsers();

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding
          type="link"
          onClick={() => dispatch(projectListActions.openProjectModal())}
        >
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      {error && (
        <Typography.Text type="danger">{error.message}</Typography.Text>
      )}
      {/* dataSource是TableProps中的属性 */}
      <List
        refresh={retry}
        loading={isLoading}
        dataSource={list || []}
        users={users || []}
      />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = true;

const Container = styled.div`
  padding: 3.2rem;
`;
