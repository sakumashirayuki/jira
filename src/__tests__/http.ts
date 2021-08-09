import { setupServer } from "msw/node"; // 用于mock异步请求
import { rest } from "msw"; // rest来自restful
import { http } from "utils/http";

// 单元测试中需要隔离外部环境
const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer();
// beforeAll是jest中的方法
// beforeAll代表执行所有的测试之前，先执行某个回调函数
beforeAll(() => server.listen());

// 表示每个测试之后，都重置msw所设置的所有模拟路由
afterEach(() => server.resetHandlers());

// 所有测试结束后，关闭mock路由
afterAll(() => server.close());

// 由jest提供
// test代表一个测试单元
test("http方法发送异步请求", async () => {
  const endpoint = "test-endpoint"; // 需要请求的地址
  const mockResult = { mockValue: "mock" }; // mock请求应当返回的值

  // 设置server的response
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      return res(ctx.json(mockResult));
    })
  );
  const result = await http(endpoint);
  expect(result).toEqual(mockResult); //不需要指向同一内存单元的相等
});

test("http请求时会在header带上tocken", async () => {
  const token = "FAKE_TOKEN";
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };

  let request: any;

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult));
    })
  );
  await http(endpoint, { token });
  expect(request.headers.get("Authorization")).toBe(`Bearer ${token}`);
});
