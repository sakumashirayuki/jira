import { render, screen } from "@testing-library/react";
import { Mark } from "components/mark";

test("Mark组件正确高亮关键词", () => {
  const name = "物料管理";
  const keyword = "管理";
  // 这里render组件
  render(<Mark name={name} keyword={keyword} />);
  //在当前screen中搜索keyword，最终会找到一个dom元素
  //预期是这个dom元素在document中
  expect(screen.getByText(keyword)).toBeInTheDocument();
  expect(screen.getByText(keyword)).toHaveStyle("color: #257afd");
  expect(screen.getByText("物料")).not.toHaveStyle("color: #257afd");
});
