import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd";
import {
  useProjectModal,
  useProjectsSearchParams,
} from "screens/project-list/utils";
import { useProjects } from "utils/project";
import { ButtonNoPadding } from "./lib";

export const ProjectPopover = () => {
  const { data: projects } = useProjects(useProjectsSearchParams()[0]);
  const pinnedProjects = projects?.filter((project) => project.pin);
  const { open } = useProjectModal();
  const content = () => {
    return (
      <ContentContainer>
        <Typography.Text type="secondary">收藏项目</Typography.Text>
        <List>
          {pinnedProjects?.map((project) => (
            <List.Item>
              <List.Item.Meta title={project.name} />
            </List.Item>
          ))}
        </List>
        <Divider />
        <ButtonNoPadding type="link" onClick={open}>
          创建项目
        </ButtonNoPadding>
      </ContentContainer>
    );
  };
  return (
    <Popover placement="bottom" content={content}>
      <span>项目</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
