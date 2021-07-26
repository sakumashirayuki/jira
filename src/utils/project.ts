import { useMutation, useQuery, useQueryClient } from "react-query";
import { Project } from "screens/project-list/list";
import { useHttp } from "./http";

export const useProjects = (param?: Partial<Project>) => {
  // name 和 personId都是Project参数的一部分
  const client = useHttp();
  // 当第一个参数数组内的值变化时，就会触发
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

export const useEditProject = () => {
  const client = useHttp();
  // useQueryClient返回QueryClient实例，QueryClient用于与cache交互
  const queryClient = useQueryClient();
  // useMutation用于create/update/delete data
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    {
      // invalidateQueries用于refetch query，这里的'projects'可以直接弱匹配到所有以'projects'开头的
      onSuccess: () => {
        console.log("success");
        queryClient.invalidateQueries("projects");
      },
    }
  );
};

export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    {
      onSuccess: () => {
        console.log("success");
        queryClient.invalidateQueries("projects");
      },
    }
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
