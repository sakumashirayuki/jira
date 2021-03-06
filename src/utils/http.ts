import qs from "qs";
import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";
import { useCallback } from "react";

const apiUrl = process.env.REACT_APP_API_URL;
// backend的应用部署在localhost:3001上
interface Config extends RequestInit {
  token?: string; // 问号表示这是一个可选参数
  data?: object;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  // fetch只能在then中捕获异常(401, 500等)
  return window
    .fetch(`${apiUrl}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await auth.logout();
        window.location.reload();
        return Promise.reject({ message: "请重新登陆" });
      } else {
        const data = await response.json();
        if (response.ok) {
          return data;
        } else {
          return Promise.reject(data);
        }
      }
    });
};

export const useHttp = () => {
  const { user } = useAuth();
  return useCallback(
    (
      ...[endpoint, config]: Parameters<typeof http> // 这里的typeof是ts中的typeof
    ) => http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  );
};
