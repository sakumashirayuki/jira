import { useAsync } from "utils/use-async";
import { renderHook, act } from "@testing-library/react-hooks";

// 用于模拟use-async的返回值
const defaultState: ReturnType<typeof useAsync> = {
  stat: "idle",
  error: null,
  data: null,
  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,
  run: expect.any(Function), // 并不重要，可以是任意函数
  setData: expect.any(Function),
  setError: expect.any(Function),
  retry: expect.any(Function),
};

const loadingState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: "loading",
  isIdle: false,
  isLoading: true,
};

const successState: ReturnType<typeof useAsync> = {
  ...defaultState,
  stat: "success",
  isIdle: false,
  isSuccess: true,
};

test("useAsync异步处理", async () => {
  let resolve: any, reject; // 这里之后会被更新为solve函数和reject函数
  // 这样做可以在Promise外部使用res和rej函数
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  // renderHook内部是需要测试的hook
  const { result } = renderHook(() => useAsync());
  // result.current代表useAsync返回的值
  expect(result.current).toEqual(defaultState); //其实没有执行任何操作，所以希望结果为默认state

  let p: Promise<any>;
  /**
   * 使用act是因为这里面包裹的函数包含一些异步的方法
   * 这里可以保证等待异步操作执行完之后，再安全地获取我们需要的值
   */
  act(() => {
    p = result.current.run(promise); // run是useAsync中的核心方法，这里p仍然是个promise
  });
  expect(result.current).toEqual(loadingState); // run之后认为处于loading state

  const resolvedValue = { mockedValue: "resolved" };
  await act(async () => {
    resolve(resolvedValue);
    await p;
  });
  expect(result.current).toEqual({
    ...successState,
    data: resolvedValue,
  }); // 此时应该处于success state
});
