import { useEffect, useState } from "react";

export const isVoid = (value) => {
  return value === undefined || value === null || value === ""; // this change the type of value to Boolean
};

export const cleanObject = (object) => {
  const result = { ...object };
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, []);
};

export const useDebounce = (value, delay) => {
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
