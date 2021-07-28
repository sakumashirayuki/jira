import { QueryKey, useMutation, useQuery } from "react-query";
import { Project } from "screens/project-list/list";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";

export const useProjects = (param?: Partial<Project>) => {
  // name 和 personId都是Project参数的一部分
  const client = useHttp();
  // 当第一个参数数组内的值变化时，就会触发
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

// queryKey = ['projects', searchParams] 从外部获取
export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  // useMutation用于create/update/delete data
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
  );
};

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};

// 为什么id是可选的？
export const useProject = (id?: number) => {
  const client = useHttp();
  //当id为undefined时，不执行query
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    { enabled: !!id }
  );
};
