import api from "./axios";

export const login = async (email, password) => {
  const { data } = await api.post("/api/v1/auth/login", { email, password });
  localStorage.setItem("token", data.accessToken);
  return data;
};

export const signup = async (email, password) => {
  const { data } = await api.post("/api/v1/auth/signup", { email, password });
  return data;
};

export const logout = async () => {
  localStorage.removeItem("token");
};

// ✅ 1차: 토큰 존재로 빠르게 로그인 여부 판단
export const hasToken = () => {
  return !!localStorage.getItem("token");
};

export const checkSession = async () => {
  try {
    const { data } = await api.get("/api/v1/auth/me");
    return data; // { ok:true, userId, email, role }
  } catch (e) {
    localStorage.removeItem("token");
    return { ok: false };
  }
};
