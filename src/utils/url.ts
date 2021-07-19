import { useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { cleanObject } from "utils";

// 返回页面url中，指定键的参数值
// 传入url
// 返回对象
// 使用泛型可以避免指定类型
// 传入的泛型必须是string
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  // 这里的searchParams是个iterable
  const [searchParams, setSearchParams] = useSearchParams();
  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
          // key in string 几乎等同于 key: string的写法
        }, {} as { [key in K]: string }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams] // React 认为只有在显式地调用了setSearchParams时，searchParams才发生改变
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      setSearchParams(o);
    },
  ] as const;
};
