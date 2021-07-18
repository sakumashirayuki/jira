import { Link, Route, Routes, Navigate } from "react-router-dom";
import { EpicScreen } from "screens/epic";
import { KanbanScreen } from "screens/kanban";

export const ProjectScreen = () => {
  return (
    <div>
      <h1>project screen</h1>
      {/* Link的to如果加上斜线，则代表根路由 */}
      <Link to="kanban">看板</Link>
      <Link to="epic">任务组</Link>
      <Routes>
        {/* Route会自动将path append到组件对应的大路由上 */}
        {/* /projects/:projectId/kanban */}
        <Route path="/kanban" element={<KanbanScreen />} />
        {/* /projects/:projectId/epic */}
        <Route path="/epic" element={<EpicScreen />} />
        {/* 默认路由，自动跳转到/projects/:projectId/kanban */}
        <Navigate to={window.location.pathname + "/kanban"} />
      </Routes>
    </div>
  );
};
