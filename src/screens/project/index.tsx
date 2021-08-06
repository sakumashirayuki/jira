import styled from "@emotion/styled";
import { Menu } from "antd";
import { Link, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { EpicScreen } from "screens/epic";
import { KanbanScreen } from "screens/kanban";

const useRouteType = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};

export const ProjectScreen = () => {
  const routeType = useRouteType();
  return (
    <Container>
      {/* Link的to如果加上斜线，则代表根路由 */}
      <Aside>
        <Menu mode="inline" selectedKeys={[routeType]}>
          <Menu.Item key={"kanban"}>
            <Link to="kanban">看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to="epic">任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          {/* Route会自动将path append到组件对应的大路由上 */}
          {/* /projects/:projectId/kanban */}
          <Route path="/kanban" element={<KanbanScreen />} />
          {/* /projects/:projectId/epic */}
          <Route path="/epic" element={<EpicScreen />} />
          {/*
          原先的写法
          <Navigate to={window.location.pathname + "/kanban"} /> 
          默认路由，自动跳转到/projects/:projectId/kanban 
          此时的history栈为
          ['projects', 'projects/:projectId', 'projects/:projectId/kanban']
          即使从'projects/:projectId/kanban'回退，会读取'projects/:projectId'，则又会匹配到'projects/:projectId/kanban'，导致永远无法回退到真正的前一个浏览历史.
          现在增加一个参数
          <Navigate to={window.location.pathname + "/kanban"} replace={true}/>
          则history栈变为：
          ['projects', 'projects/:projectId/kanban']
          */}
          <Navigate to={window.location.pathname + "/kanban"} replace={true} />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  display: flex;
  box-shadow: -5px 0 5px -5px rgb(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  width: 100%;
`;
