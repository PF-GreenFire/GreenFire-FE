import api from "./axios";

/**
 * 활성 배너 조회 (공개)
 */
export const getBanners = async () => {
  const { data } = await api.get("/api/banners");
  return data;
};

/**
 * 전체 배너 조회 (관리자)
 */
export const getAdminBanners = async () => {
  const { data } = await api.get("/api/banners/admin");
  return data;
};

/**
 * 배너 생성 (관리자)
 * @param {FormData} formData - banner(JSON) + file(이미지)
 */
export const createBanner = async (formData) => {
  const { data } = await api.post("/api/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

/**
 * 배너 수정 (관리자)
 * @param {number} bannerCode
 * @param {FormData} formData
 */
export const updateBanner = async (bannerCode, formData) => {
  const { data } = await api.put(`/api/banners/${bannerCode}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

/**
 * 배너 삭제 (관리자)
 * @param {number} bannerCode
 */
export const deleteBanner = async (bannerCode) => {
  const { data } = await api.delete(`/api/banners/${bannerCode}`);
  return data;
};
