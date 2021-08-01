import { useQuery } from "react-query";
import { TaskType } from "types/task-type";
import { useHttp } from "./http";

export const useTaskTypes = () => {
  // name 和 personId都是Project参数的一部分
  const client = useHttp();
  // 当第一个参数数组内的值变化时，就会触发
  return useQuery<TaskType[]>(["taskTypes"], () => client("taskTypes")); // 具有多次query只执行一次client("tasks", { data: param })的功能
};
