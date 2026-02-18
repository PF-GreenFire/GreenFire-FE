import api from "./axios";

/**
 * 공지사항 목록 조회
 * @param {Object} params - { page, limit, category, searchKeyword, userCode }
 */
export const getNoticeList = async (params) => {
  const { data } = await api.get("/api/notices", { params });
  return data;
};

/**
 * 공지사항 상세 조회
 * @param {number} noticeCode 
 * @param {string} userCode - 조회 기록 저장용 (옵션)
 */
export const getNoticeDetail = async (noticeCode, userCode) => {
  const params = userCode ? { userCode } : {};
  const { data } = await api.get(`/api/notices/${noticeCode}`, { params });
  return data;
};

/**
 * 공지사항 조회수 증가
 * @param {number} noticeCode 
 * @param {string} userCode 
 */
export const incrementNoticeView = async (noticeCode, userCode) => {
  const { data } = await api.post(`/api/notices/${noticeCode}/view`, { userCode });
  return data;
};

/**
 * 관련 공지사항 조회
 * @param {number} noticeCode 
 * @param {number} limit 
 */
export const getRelatedNotices = async (noticeCode, limit = 5) => {
  const { data } = await api.get(`/api/notices/${noticeCode}/related`, { 
    params: { limit } 
  });
  return data;
};

/**
 * 첨부파일 다운로드 URL 생성
 * @param {number} attachmentCode 
 */
export const getAttachmentDownloadUrl = (attachmentCode) => {
  return `${process.env.REACT_APP_API_URL}/api/notices/attachments/${attachmentCode}/download`;
};

/**
 * 공지사항 생성 (관리자)
 * @param {FormData} formData 
 */
export const createNotice = async (formData) => {
  const { data } = await api.post("/api/notices", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

/**
 * 공지사항 수정 (관리자)
 * @param {number} noticeCode 
 * @param {FormData} formData 
 */
export const updateNotice = async (noticeCode, formData) => {
  const { data } = await api.put(`/api/notices/${noticeCode}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

/**
 * 공지사항 삭제 (관리자)
 * @param {number} noticeCode 
 */
export const deleteNotice = async (noticeCode) => {
  const { data } = await api.delete(`/api/notices/${noticeCode}`);
  return data;
};