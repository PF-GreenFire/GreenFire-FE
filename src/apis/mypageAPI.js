import api from "./axios";
import {
  getMypageRequest,
  getMypageSuccess,
  getMypageFailure,
  getUserInfoRequest,
  getUserInfoSuccess,
  getUserInfoFailure,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserInfoFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  withdrawUserRequest,
  withdrawUserSuccess,
  withdrawUserFailure,
} from "../modules/MypageReducer";
import { base64ToFile } from "../utils/imageUtils";

/**
 * 마이페이지 전체 데이터 조회
 */
export const getMypageAPI = () => {
  return async (dispatch) => {
    dispatch(getMypageRequest());

    try {
      const result = await api.get("/user/me/summary");

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

/**
 * 사용자 정보 조회
 */
export const getUserInfoAPI = () => {
  return async (dispatch) => {
    dispatch(getUserInfoRequest());

    try {
      const result = await api.get("/user/me");

      console.log("getUserInfoAPI result:", result.data);

      if (result.status === 200) {
        dispatch(getUserInfoSuccess(result));
      }
    } catch (error) {
      console.error("사용자 정보 조회 중 에러가 발생했습니다:", error);
      dispatch(
        getUserInfoFailure(
          error.message || "사용자 정보를 불러오는데 실패했습니다.",
        ),
      );
    }
  };
};

/**
 * 사용자 정보 수정 (FormData - multipart/form-data)
 * @param {Object} textData - 텍스트 데이터 (JSON)
 * @param {string|null} profileImage - 프로필 이미지 (base64 또는 URL)
 */
export const updateUserInfoAPI = (textData, profileImage) => {
  return async (dispatch) => {
    dispatch(updateUserInfoRequest());

    try {
      const formData = new FormData();

      // JSON 데이터를 Blob으로 변환해서 추가
      formData.append(
        "data",
        new Blob([JSON.stringify(textData)], { type: "application/json" }),
      );

      // 이미지 처리
      if (profileImage) {
        if (profileImage.startsWith("data:")) {
          // base64인 경우 File로 변환
          const file = base64ToFile(profileImage, "profile.jpg");
          formData.append("image", file);
        }
        // else {
        //   // URL인 경우 (기본 프로필 이미지 등)
        //   formData.append("imageUrl", profileImage);
        // }
      }

      const result = await api.put("/user/me", formData);

      console.log("updateUserInfoAPI result:", result.data);

      if (result.status === 200) {
        dispatch(updateUserInfoSuccess(result));
        return { success: true };
      }
    } catch (error) {
      console.error("사용자 정보 수정 중 에러가 발생했습니다:", error);
      dispatch(
        updateUserInfoFailure(error.message || "정보 수정에 실패했습니다."),
      );
      return { success: false, error: error.message };
    }
  };
};

/**
 * 비밀번호 변경
 * @param {Object} passwordData - 비밀번호 정보
 * @param {string} passwordData.currentPassword - 현재 비밀번호
 * @param {string} passwordData.newPassword - 새 비밀번호
 */
export const changePasswordAPI = (passwordData) => {
  return async (dispatch) => {
    dispatch(changePasswordRequest());

    try {
      const result = await api.put("/user/me/password", passwordData);

      console.log("changePasswordAPI result:", result.data);

      if (result.status === 200) {
        dispatch(changePasswordSuccess());
        return { success: true };
      }
    } catch (error) {
      console.error("비밀번호 변경 중 에러가 발생했습니다:", error);
      dispatch(
        changePasswordFailure(error.message || "비밀번호 변경에 실패했습니다."),
      );
      return { success: false, error: error.message };
    }
  };
};

/**
 * 회원 탈퇴
 */
export const withdrawUserAPI = () => {
  return async (dispatch) => {
    dispatch(withdrawUserRequest());

    try {
      const result = await api.delete("/user/me");

      console.log("withdrawUserAPI result:", result.data);

      if (result.status === 200) {
        dispatch(withdrawUserSuccess());
        // 로컬스토리지 토큰 삭제
        localStorage.removeItem("token");
        return { success: true };
      }
    } catch (error) {
      console.error("회원 탈퇴 중 에러가 발생했습니다:", error);
      dispatch(
        withdrawUserFailure(error.message || "회원 탈퇴에 실패했습니다."),
      );
      return { success: false, error: error.message };
    }
  };
};
