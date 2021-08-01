import { useQuery } from "react-query";
import { Task } from "types/Task";
import { useHttp } from "./http";

export const useTasks = (param?: Partial<Task>) => {
  // name 和 personId都是Project参数的一部分
  const client = useHttp();
  // 当第一个参数数组内的值变化时，就会触发
  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: param })
  ); // 具有多次query只执行一次client("tasks", { data: param })的功能
};
