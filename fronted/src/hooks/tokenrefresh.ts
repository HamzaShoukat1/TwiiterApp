// utils/apiFetch.ts

import { refreshToken } from "../Apis.tsx/index.ts";

let isRefreshing = false;

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401 && !isRefreshing) {
    try {
      isRefreshing = true;

      // call refresh token function
      await refreshToken();

      isRefreshing = false;

      // retry original request
      res = await fetch(url, {
        ...options,
        credentials: "include",
      });

    } catch (error) {
      isRefreshing = false;

      // logout fallback
      localStorage.removeItem("auth");
      window.location.href = "/sign-in";
    }
  }

  return res;
};