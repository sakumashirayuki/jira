import { createContext, ReactNode, useContext } from "react";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { useMount } from "utils";
import { http } from "utils/http";
import { useAsync } from "utils/use-async";
import * as auth from "../auth-provider";
import { useQueryClient } from "react-query";
import { User } from "types/User";

interface AuthForm {
  username: string;
  password: string;
}

const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token }); // 使用http是为了自己指定token
    user = data.user;
  }
  return user;
};

const AuthContext = createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();
  const queryClient = useQueryClient();
  // point free
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () =>
    auth.logout().then(() => {
      setUser(null);
      queryClient.clear(); // 清楚所有useQuery的数据
    });

  useMount(() => {
    run(bootstrapUser()); // 检查登录状态
  });

  if (isIdle || isLoading) return <FullPageLoading />;

  if (isError) return <FullPageErrorFallback error={error} />;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // the context does not exist
    throw new Error("useAuth must be used inside the AuthProvider");
  }
  return context;
};
