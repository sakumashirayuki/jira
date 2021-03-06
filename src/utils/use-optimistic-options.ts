import { QueryKey, useQueryClient } from "react-query";
import { Task } from "types/Task";
import { reorder } from "./reorder";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[] // callback参数用于乐观更新
) => {
  // useQueryClient返回QueryClient实例，QueryClient用于与cache交互
  const queryClient = useQueryClient();
  return {
    onSuccess: () => {
      // 主要是用来mutate完了之后及时刷新数据
      // invalidateQueries用于refetch query，这里的'projects'可以直接弱匹配到所有以'projects'开头的
      console.log("success");
      queryClient.invalidateQueries(queryKey);
    },
    async onMutate(target: any) {
      // 用于乐观更新。
      // useMutation一发生，onMutate就被调用
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        // 如果project id与target id相符，则覆盖数据
        return callback(target, old);
      });
      return { previousItems }; // 返回值与回滚机制有关
    },
    onError(error: any, newItem: any, context: any) {
      // 当useMutation发生异常，失败的时候
      // onMutate返回的previousItems存在与context中
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};
// 如果old为undefined就返回空数组
export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : [target]));

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    //乐观更新task序列中的位置
    const orderedList = reorder({ list: old, ...target }) as Task[];
    //这是由于task排序还可能涉及到所属kanban的改变，所以也要改变kanbanId
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });
