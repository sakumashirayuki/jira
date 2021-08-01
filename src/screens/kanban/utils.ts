import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useKanbans } from "utils/kanban";
import { useProject } from "utils/project";
import { useTasks } from "utils/task";
import { useUrlQueryParam } from "utils/url";

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  //console.log(pathname);
  const id = pathname.match(/projects\/(\d+)/)?.[1]; //括号包裹的内容会成为返回值的第二个数据
  return Number(id);
};

export const useProjectInUrl = () => useProject(useProjectIdInUrl()); //返回project

export const useKanbansInProject = () =>
  useKanbans({ projectId: useProjectIdInUrl() });

export const useTasksInProject = () =>
  useTasks({ projectId: useProjectIdInUrl() });

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useKanbanQueryKey = () => ["kanbans", useKanbanSearchParams()];

// 从url获取param。且为url设置param
export const useTasksSearchParams = () => {
  const [param, setParam] = useUrlQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  const projectId = useProjectIdInUrl();
  const tasksParam = useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: param.name,
    }),
    [projectId, param]
  );
  return [tasksParam, setParam] as const;
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()[0]];
