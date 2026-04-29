import api from "./axios";
import {
  getStores,
  getStoreCategories,
  getStoreDetail,
  getStoreDetailError,
  toggleStoreLike,
} from "../modules/StoreReducer";

export const getAllStoresAPI = () => {
  return async (dispatch, getState) => {
    try {
      const result = await api.get("/location");

      if (result.status === 200) {
        dispatch(getStores(result));
      }
    } catch (error) {
      console.error("매장 목록 조회 중 에러가 발생했습니다.", error);
    }
  };
};

export const getStoreCategoriesAPI = () => {
  return async (dispatch, getState) => {
    try {
      const result = await api.get("/location/categories");

      if (result.status === 200) {
        dispatch(getStoreCategories(result));
      }
    } catch (error) {
      console.error("매장 카테고리 조회 중 에러가 발생했습니다.", error);
    }
  };
};

// 매장 좋아요 토글
export const toggleStoreLikeAPI = (storeCode, isLiked) => {
  return async (dispatch) => {
    dispatch(toggleStoreLike(storeCode));
    try {
      if (isLiked) {
        await api.delete(`/location/stores/${storeCode}/like`);
      } else {
        await api.post(`/location/stores/${storeCode}/like`);
      }
    } catch (error) {
      console.error("좋아요 처리 중 에러가 발생했습니다.", error);
      dispatch(toggleStoreLike(storeCode));
    }
  };
};

// 매장 상세 조회
export const getStoreDetailAPI = (storeCode) => {
  return async (dispatch) => {
    try {
      const result = await api.get(`/location/stores/${storeCode}`);

      if (result.status === 200) {
        dispatch(getStoreDetail(result));
      }
    } catch (error) {
      console.error("가게 정보 조회 중 에러가 발생했습니다.", error);
      dispatch(getStoreDetailError());
    }
  };
};

// 매장 신청 등록
export const registApplyStoreAPI = (payload) => async () => {
  const result = await api.post("/stores/apply", payload);
  const location = result.headers?.location || result.headers?.Location;
  const storeCode = location ? Number(location.split("/").pop()) : null;
  return { storeCode };
};

// 본인이 신청한 매장 목록
export const getMyApplyStoresAPI = ({ page = 1, limit = 10 } = {}) => async () => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const result = await api.get(`/stores/apply/list?${params.toString()}`);
  return result.data; // { paging, storeList }
};

// (어드민) 상태별 매장 목록 페이징
export const getStoresByStatusAPI = ({ status, page = 1, limit = 10 } = {}) => async () => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const result = await api.get(`/stores/${status}/list?${params.toString()}`);
  return result.data; // { paging, storeList }
};

// (어드민) 매장 상태 변경
export const updateStoreStatusAPI = (storeCode, status) => async () => {
  const result = await api.patch(`/stores/change/${storeCode}`, { status });
  return result.data;
};
