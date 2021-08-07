import { useQuery } from "react-query";
import { User } from "types/User";
import { useHttp } from "./http";

export const useUsers = (param?: Partial<User>) => {
  // name 和 personId都是Project参数的一部分
  const client = useHttp();
  // 当第一个参数数组内的值变化时，就会触发
  return useQuery<User[]>(["users", param], () =>
    client("users", { data: param })
  );
};
