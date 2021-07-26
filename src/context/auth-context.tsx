import { ReactNode } from "react";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { useMount } from "utils";
import { http } from "utils/http";
import { useAsync } from "utils/use-async";
import * as auth from "../auth-provider";
import { User } from "../screens/project-list/search-panel";
import * as authStore from "store/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

export interface AuthForm {
  username: string;
  password: string;
}

// 由localStorage检查登录
export const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token }); // 使用http是为了自己指定token
    user = data.user;
  }
  return user;
};

// 改装后的provider和context没有关系，只是一个普通的组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { error, isLoading, isIdle, isError, run } = useAsync<User | null>();

  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();

  useMount(() => {
    run(dispatch(authStore.bootstrap())); // 检查登录状态
  });

  if (isIdle || isLoading) return <FullPageLoading />;

  if (isError) return <FullPageErrorFallback error={error} />;

  return <div>{children}</div>;
};

export const useAuth = () => {
  // 需要显式声明dispatch返回promise
  const dispatch: (...args: unknown[]) => Promise<User> = useDispatch();
  const user = useSelector(authStore.selectUser);
  const login = useCallback(
    (form: AuthForm) => dispatch(authStore.login(form)),
    [dispatch]
  );
  const register = useCallback(
    (form: AuthForm) => dispatch(authStore.regiter(form)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(authStore.logout()), [dispatch]);
  return {
    user,
    login,
    register,
    logout,
  };
};
