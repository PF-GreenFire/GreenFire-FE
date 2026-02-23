import api from "./axios";
import { getStores } from "../modules/StoreReducer";

export const getAllStoresAPI = () => {
  return async (dispatch, getState) => {
    try {
      const result = await api.get("/stores");

      if (result.status === 200) {
        dispatch(getStores(result));
      }
    } catch (error) {
      console.error("매장 목록 조회 중 에러가 발생했습니다.", error);
    }
  };
};
