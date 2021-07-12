import { useEffect, useState } from "react";

export const isVoid = (value: unknown) => {
  return value === undefined || value === null || value === ""; // this change the type of value to Boolean
};

// 这里object的类型设定可以限制object为键值对对象。排除了函数、正则表达式对象
export const cleanObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // 如果在依赖项中加上callback()，会造成无限循环，这个和useCallback和useMemo有关系
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// 后面用泛型
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // 每次在上一个useEffect处理完之后运行
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};
