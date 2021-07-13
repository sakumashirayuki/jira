import { useState } from "react";

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

export const useAsync = <D>(initialState?: State<D>) => {
  const [state, setState] = useState<State<D>>({
    ...defaultInitState,
    ...initialState,
  });

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
  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      // 当什么都没有传或者传入的不是promise时
      throw new Error("please pass in Promise");
    }
    setState({
      ...state,
      stat: "loading",
    });
    return promise
      .then((data) => {
        setData(data);
        return data; // 这里返回的仍然是一个promise
      })
      .catch((error) => {
        setError(error);
        return error;
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
    ...state,
  };
};
