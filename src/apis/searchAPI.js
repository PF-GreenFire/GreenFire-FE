import api from "./axios";

/**
 * 통합 검색 endpoint. type 별로 호출.
 * type: ALL | CHALLENGE | STORE | POST | USER
 * 응답: { query, type, items: [{type, id, title, subtitle, thumbnail}], total }
 */
export const searchByType = async (type, q, size = 20) => {
  if (!q || !q.trim()) return { query: q, type, items: [], total: 0 };
  const params = new URLSearchParams({ q: q.trim(), type, size: String(size) });
  const { data } = await api.get(`/api/search?${params.toString()}`);
  return data;
};
