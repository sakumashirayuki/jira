import React, { PropsWithChildren, ReactElement } from "react";
//<Props, State>
// 其中props需要：children, fallbackRender
type FallbackRender = (props: { error: Error | null }) => ReactElement;
// 错误边界仅能捕获其子组件的错误
export class ErrorBoundary extends React.Component<
  PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  state = { error: null };
  // 当子组件抛出异常，这里会接收到并调用
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) return fallbackRender({ error });
    return children;
  }
}
