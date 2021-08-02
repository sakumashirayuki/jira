import styled from "@emotion/styled";
import { Button, Dropdown, Menu } from "antd";
import {
  Navigate,
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import { ProjectScreen } from "screens/project";
import { resetRoute } from "utils";
import { useAuth } from "context/auth-context";
import { ProjectListScreen } from "screens/project-list";
import { ButtonNoPadding, Row } from "components/lib";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { ProjectModal } from "screens/project-list/projectModal";
import { ProjectPopover } from "components/project-popover";

export const AuthenticatedApp = () => {
  // const value: any = undefined;
  return (
    <Container>
      {/* 渲染中的异常，error-boundary能够处理
      {value.notExist} */}
      <Router>
        <PageHeader />
        <Main>
          <Routes>
            <Route path="/projects" element={<ProjectListScreen />} />
            <Route path="/projects/:projectId/*" element={<ProjectScreen />} />
            {/* 默认路由 */}
            <Navigate to="/projects" />
          </Routes>
        </Main>
        <ProjectModal />
      </Router>
    </Container>
  );
};

// const HeaderItem = styled.h3`
//   margin-right: 3rem;
// `;

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        {/* 重置路由 */}
        <ButtonNoPadding type="link" onClick={resetRoute}>
          <SoftwareLogo width="18rem" color="rgb(38, 132, 255)" />
        </ButtonNoPadding>
        <ProjectPopover />
        <span>用户</span>
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { logout, user } = useAuth();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="logout">
            <Button type="link" onClick={logout}>
              登出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      <Button type="link" onClick={(e) => e.preventDefault()}>
        Hi, {user?.name}
      </Button>
    </Dropdown>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;

const HeaderRight = styled.div``;

const Main = styled.main`
  display: flex; //flex组件的子组件在主轴上和flex一样长（宽）
  overflow: hidden;
`;
