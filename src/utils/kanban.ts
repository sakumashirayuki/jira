import { QueryKey, useMutation, useQuery } from "react-query";
import { Kanban } from "types/Kanban";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useReorderConfig,
} from "./use-optimistic-options";

export const useKanbans = (param?: Partial<Kanban>) => {
  // name 和 personId都是Project参数的一部分
  const client = useHttp();
  // 当第一个参数数组内的值变化时，就会触发
  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};

export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans/${params.id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
/**
 * 把 fromId的看板提起来，放到refenceId处，可能是前面(before)或者后面(after)
 */
export interface SortProps {
  fromId: number; // 对于reorderKanban，代表kanban的id；对于reorderTask，代表task的id
  referenceId: number;
  type: "before" | "after";
  fromKanbanId?: number; // 用于reorder task
  toKanbanId?: number;
}

export const useReorderKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: SortProps) => {
    return client("kanbans/reorder", {
      data: params,
      method: "POST",
    });
  }, useReorderConfig(queryKey));
};
