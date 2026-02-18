import api from "./axios";
import { setAccessToken, getAccessToken } from "./axios";

export const login = async (email, password) => {
  const { data } = await api.post("/api/auth/login", { email, password });
  // Access Token은 메모리에만 저장 (localStorage X)
  setAccessToken(data.accessToken);
  return data;
};

export const signup = async ({ email, password, name, nickname, birth, gender, phone, profileImage }) => {
  const formData = new FormData();
  const jsonData = { email, password, name, nickname, birth: birth || null, gender: gender || null, phone: phone || null };
  formData.append("data", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  const { data } = await api.post("/api/auth/signup", formData);
  return data;
};

export const refresh = async () => {
  // HttpOnly 쿠키가 자동 전송됨 (withCredentials: true)
  const { data } = await api.post("/api/auth/refresh");
  setAccessToken(data.accessToken);
  return data;
};

export const logout = async () => {
  try {
    await api.post("/api/auth/logout");
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
    const { data } = await api.get("/api/auth/me");
    return data; // { ok:true, userId, email, role }
  } catch (e) {
    setAccessToken(null);
    return { ok: false };
  }
};

export const checkEmailAvailable = async (email) => {
  const { data } = await api.get("/api/auth/check-email", {
    params: { email },
  });
  return data; // { available: true/false }
};

export const findEmail = async (email) => {
  const { data } = await api.post("/api/auth/find-email", { email });
  return data; // { exists: true/false, maskedEmail: "k****n@naver.com" }
};

export const sendPasswordResetCode = async (email) => {
  const { data } = await api.post("/api/auth/password-reset/send-code", { email });
  return data; // { message: "인증 코드가 발송되었습니다." }
};

export const verifyPasswordResetCode = async (email, code) => {
  const { data } = await api.post("/api/auth/password-reset/verify-code", { email, code });
  return data; // { verified: true }
};

export const resetPassword = async (email, code, newPassword) => {
  const { data } = await api.post("/api/auth/password-reset/reset", { email, code, newPassword });
  return data;
};

export const deleteAccount = async (password, reason) => {
  const { data } = await api.delete("/api/auth/account", {
    data: { password, reason },
  });
  setAccessToken(null);
  return data;
};
