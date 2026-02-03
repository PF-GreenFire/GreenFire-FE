import api from "./axios";
import {
  getMypageRequest,
  getMypageSuccess,
  getMypageFailure,
} from "../modules/MypageReducer";

/**
 * 마이페이지 전체 데이터 조회
 */
export const getMypageAPI = () => {
  return async (dispatch, getState) => {
    dispatch(getMypageRequest());

    try {
      const result = await api.get("/user");

      console.log("getMypageAPI result:", result.data);

      if (result.status === 200) {
        dispatch(getMypageSuccess(result));
      }
    } catch (error) {
      console.error("마이페이지 데이터 조회 중 에러가 발생했습니다:", error);
      dispatch(
        getMypageFailure(error.message || "통신 중 에러가 발생했습니다."),
      );
    }
  };
};
