import { useEffect, useRef, useState } from "react";

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
// 括号前的<V>帮助我们获得参数的类型
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

// React hook与闭包
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  // useRef可以方便地保存任何可变的值
  const oldTitle = useRef(document.title).current;
  // console.log("渲染时的oldTitle", oldTitle);
  useEffect(() => {
    document.title = title;
  }, [title]);
  // 闭包，这里读到的是旧title
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle; // set the title back as the previous title
        console.log("卸载时的oldTitle", oldTitle);
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

// 重置路由状态，也可以刷新界面
export const resetRoute = () => (window.location.href = window.location.origin);

/**
 * 返回组件的挂载状态，如果还没挂载或者已经卸载，返回false；反之，返回true
 */
export const useMountedRef = () => {
  const moutedRef = useRef(false);
  useEffect(() => {
    moutedRef.current = true;
    return () => {
      moutedRef.current = false;
    };
  });
  return moutedRef;
};
