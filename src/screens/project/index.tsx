import { Link, Route, Routes, Navigate } from "react-router-dom";
import { EpicScreen } from "screens/epic";
import { KanbanScreen } from "screens/kanban";

export const ProjectScreen = () => {
  return (
    <div>
      {/* Link的to如果加上斜线，则代表根路由 */}
      <Link to="kanban">看板</Link>
      <Link to="epic">任务组</Link>
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
    </div>
  );
};
