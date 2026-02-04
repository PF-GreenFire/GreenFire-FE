import api from "./axios";
import { setAccessToken, getAccessToken } from "./axios";

export const login = async (email, password) => {
  const { data } = await api.post("/api/v1/auth/login", { email, password });
  // Access Token은 메모리에만 저장 (localStorage X)
  setAccessToken(data.accessToken);
  return data;
};

export const signup = async (email, password) => {
  const { data } = await api.post("/api/v1/auth/signup", { email, password });
  return data;
};

export const refresh = async () => {
  // HttpOnly 쿠키가 자동 전송됨 (withCredentials: true)
  const { data } = await api.post("/api/v1/auth/refresh");
  setAccessToken(data.accessToken);
  return data;
};

export const logout = async () => {
  try {
    await api.post("/api/v1/auth/logout");
  } finally {
    setAccessToken(null);
  }
};

// 메모리 기반 토큰 존재 확인
export const hasToken = () => {
  return !!getAccessToken();
};

export const checkSession = async () => {
  try {
    const { data } = await api.get("/api/v1/auth/me");
    return data; // { ok:true, userId, email, role }
  } catch (e) {
    setAccessToken(null);
    return { ok: false };
  }
};

export const checkEmailAvailable = async (email) => {
  const { data } = await api.get("/api/v1/auth/check-email", {
    params: { email },
  });
  return data; // { available: true/false }
};

export const deleteAccount = async (password, reason) => {
  const { data } = await api.delete("/api/v1/auth/account", {
    data: { password, reason },
  });
  setAccessToken(null);
  return data;
};
