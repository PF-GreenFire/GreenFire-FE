import api from "./axios";
import { getStores, getStoreCategories } from "../modules/StoreReducer";

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
