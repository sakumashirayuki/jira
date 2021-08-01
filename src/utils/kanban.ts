import { useQuery } from "react-query";
import { Kanban } from "types/Kanban";
import { useHttp } from "./http";

export const useKanbans = (param?: Partial<Kanban>) => {
  // name 和 personId都是Project参数的一部分
  const client = useHttp();
  // 当第一个参数数组内的值变化时，就会触发
  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};
