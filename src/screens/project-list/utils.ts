import { useMemo } from "react";
import { useUrlQueryParam } from "utils/url";

// 项目列表搜索的参数
export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  const projectsParam = useMemo(
    () => ({ ...param, personId: Number(param.personId) || undefined }),
    [param]
  );
  return [projectsParam, setParam] as const;
};

// 这个hook用到了router，使用它的组件应该被包裹在Router内部
// 用url参数来保存全局状态
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectModalOpen] = useUrlQueryParam([
    "projectCreate",
  ]);
  const open = () => setProjectModalOpen({ projectCreate: true });
  const close = () => setProjectModalOpen({ projectCreate: undefined });

  //如果使用tuple，这些值可以随意命名，类似useState，但需要注意顺序
  return {
    projectModalOpen: projectCreate === "true",
    open,
    close,
  } as const;
};
