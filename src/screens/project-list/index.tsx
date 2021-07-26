import styled from "@emotion/styled";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import { useDebounce, useDocumentTitle } from "utils";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectModal, useProjectsSearchParams } from "./utils";
import { ButtonNoPadding, ErrorBox, Row } from "components/lib";

export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);

  const [param, setParam] = useProjectsSearchParams();
  const debouncedParam = useDebounce(param, 200);
  const { isLoading, error, data: list } = useProjects(debouncedParam);
  const { data: users } = useUsers();
  const { open } = useProjectModal();

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding type="link" onClick={open}>
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel param={param} setParam={setParam} users={users || []} />
      <ErrorBox error={error} />
      {/* dataSource是TableProps中的属性 */}
      <List loading={isLoading} dataSource={list || []} users={users || []} />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = true;

const Container = styled.div`
  padding: 3.2rem;
`;
