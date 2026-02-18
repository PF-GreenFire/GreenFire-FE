import api from "./axios";

/**
 * 대시보드 통계 조회
 */
export const getDashboardStats = async () => {
  const { data } = await api.get("/api/admin/dashboard");
  return data;
};

/**
 * 회원 목록 조회 (페이징, 검색)
 * @param {number} page
 * @param {number} size
 * @param {string} keyword - 이메일 검색 키워드
 */
export const getMembers = async (page = 1, size = 20, keyword = '') => {
  const params = { page, size };
  if (keyword) params.keyword = keyword;
  const { data } = await api.get("/api/admin/members", { params });
  return data;
};

/**
 * 회원 역할 변경
 * @param {number} userId
 * @param {string} role - "ADMIN" | "USER" | "MANAGER"
 */
export const changeUserRole = async (userId, role) => {
  const { data } = await api.put(`/api/admin/members/${userId}/role`, { role });
  return data;
};

/**
 * 회원 상세 정보 조회
 * @param {number} userId
 */
export const getMemberDetail = async (userId) => {
  const { data } = await api.get(`/api/admin/members/${userId}`);
  return data;
};

/**
 * 회원 정지
 * @param {number} userId
 * @param {string} reason - 정지 사유
 * @param {string|null} until - 정지 해제일 (ISO string, null이면 영구)
 */
export const suspendMember = async (userId, reason, until) => {
  const { data } = await api.post(`/api/admin/members/${userId}/suspend`, { reason, until });
  return data;
};

/**
 * 회원 정지 해제
 * @param {number} userId
 */
export const unsuspendMember = async (userId) => {
  const { data } = await api.post(`/api/admin/members/${userId}/unsuspend`);
  return data;
};

/**
 * 현재 사용자 역할 기반 접근 가능 페이지 목록
 */
export const getAccessiblePages = async () => {
  const { data } = await api.get("/api/pages/me");
  return data;
};
