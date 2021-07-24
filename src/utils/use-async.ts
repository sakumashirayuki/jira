import { useState } from "react";
import { useMountedRef } from "utils";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitState: State<null> = {
  error: null,
  data: null,
  stat: "idle",
};

const defaultConfig = {
  throwOnError: false,
};

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig }; //用传入的initialConfig覆盖defaultConfig
  const [state, setState] = useState<State<D>>({
    ...defaultInitState,
    ...initialState,
  });
  const mountedRef = useMountedRef();

  const [retry, setRetry] = useState(() => () => {});

  const setData = (data: D) => {
    setState({
      data,
      stat: "success",
      error: null,
    });
  };

  const setError = (error: Error) => {
    setState({
      error,
      data: null,
      stat: "error",
    });
  };

  // run函数用于触发异步请求
  const run = (
    promise: Promise<D>,
    runConfig?: { retry: () => Promise<D> }
  ) => {
    if (!promise || !promise.then) {
      // 当什么都没有传或者传入的不是promise时
      throw new Error("please pass in Promise");
    }
    // 保存promise函数
    setRetry(() => () => {
      // retry是个函数，这里调用retry函数，并将返回的promise赋给run
      if (runConfig?.retry) run(runConfig?.retry(), runConfig);
    });
    setState({
      ...state,
      stat: "loading",
    });
    return promise
      .then((data) => {
        // 避免组件已经卸载了，还在赋值 的情况发生
        if (mountedRef) setData(data);
        return data; // 这里返回的仍然是一个promise
      })
      .catch((error) => {
        setError(error);
        if (config.throwOnError) return Promise.reject(error);
        // 让外部能够接收到异常
        else return error; // 外部不会接收到异常
      });
  };

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    // retry被调用时，重新跑一遍run，让state刷新
    retry,
    ...state,
  };
};
