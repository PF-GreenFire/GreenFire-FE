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
