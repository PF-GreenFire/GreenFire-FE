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
  getEchoPostsSuccess,
  getEchoLikedPostsSuccess,
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
 * @param {boolean} isImageDeleted - 프로필 이미지 삭제 여부
 */
export const updateUserInfoAPI = (
  textData,
  profileImage,
  isImageDeleted = false,
) => {
  return async (dispatch) => {
    dispatch(updateUserInfoRequest());

    try {
      const formData = new FormData();

      // JSON 데이터를 Blob으로 변환해서 추가 (이미지 삭제 플래그 포함)
      const dataToSend = isImageDeleted
        ? { ...textData, deleteProfileImage: true }
        : textData;

      formData.append(
        "data",
        new Blob([JSON.stringify(dataToSend)], { type: "application/json" }),
      );

      // 이미지 처리
      if (profileImage) {
        if (profileImage.startsWith("data:")) {
          // base64인 경우 File로 변환
          const file = base64ToFile(profileImage, "profile.jpg");
          formData.append("image", file);
        }
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
 * 커버 이미지 변경 (FormData - multipart/form-data)
 * @param {string|null} coverImage - 커버 이미지 (base64, 경로 문자열, 또는 null)
 */
export const updateCoverImageAPI = (coverImage) => {
  return async () => {
    try {
      const formData = new FormData();

      if (coverImage) {
        formData.append(
          "data",
          new Blob([JSON.stringify({ deleteCoverImage: false })], {
            type: "application/json",
          }),
        );

        if (coverImage.startsWith("data:")) {
          const file = base64ToFile(coverImage, "cover.jpg");
          formData.append("image", file);
        }
      } else {
        formData.append(
          "data",
          new Blob([JSON.stringify({ deleteCoverImage: true })], {
            type: "application/json",
          }),
        );
      }

      const result = await api.put("/user/me/cover-image", formData);

      if (result.status === 200) {
        return { success: true, imagePath: result.data };
      }
    } catch (error) {
      console.error("커버 이미지 변경 중 에러가 발생했습니다:", error);
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
 * @param {string} reason - 탈퇴 사유
 */
export const withdrawUserAPI = (reason) => {
  return async (dispatch) => {
    dispatch(withdrawUserRequest());

    try {
      const result = await api.delete("/user/me", {
        data: { reason },
      });

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

/**
 * 에코메모리 게시물 추가 로드 (무한 스크롤)
 * @param {number} page - 페이지 번호
 */
export const getEchoPostsAPI = (page) => {
  return async (dispatch) => {
    try {
      const result = await api.get(`/user/me/posts?page=${page}`);

      if (result.status === 200) {
        dispatch(getEchoPostsSuccess(result));
      }
    } catch (error) {
      console.error("게시물 조회 중 에러가 발생했습니다:", error);
    }
  };
};

/**
 * 에코메모리 좋아요 게시물 로드 (무한 스크롤)
 * @param {number} page - 페이지 번호
 */
export const getEchoLikedPostsAPI = (page) => {
  return async (dispatch) => {
    try {
      const result = await api.get(`/user/me/liked-posts?page=${page}`);

      if (result.status === 200) {
        dispatch(getEchoLikedPostsSuccess(result));
      }
    } catch (error) {
      console.error("좋아요 게시물 조회 중 에러가 발생했습니다:", error);
    }
  };
};
