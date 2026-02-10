import api from "./axios";

/**
 * 신고 접수
 * @param {Object} params - { resourceType, resourceId, category, reason }
 */
export const createReport = async ({ resourceType, resourceId, category, reason }) => {
  const { data } = await api.post("/api/v1/reports", {
    resourceType,
    resourceId,
    category,
    reason,
  });
  return data;
};

/**
 * 신고 목록 조회 (관리자)
 * @param {Object} params - { page, size, status }
 */
export const getReports = async (params) => {
  const { data } = await api.get("/api/v1/admin/reports", { params });
  return data;
};

/**
 * 신고 처리 (관리자)
 * @param {number} reportId
 * @param {Object} params - { status, adminNote }
 */
export const handleReport = async (reportId, { status, adminNote }) => {
  const { data } = await api.patch(`/api/v1/admin/reports/${reportId}/handle`, {
    status,
    adminNote,
  });
  return data;
};

/**
 * 대기 중인 신고 건수 조회 (관리자)
 */
export const getPendingReportCount = async () => {
  const { data } = await api.get("/api/v1/admin/reports/pending-count");
  return data;
};
