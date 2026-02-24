import api from "./axios";
import {
  getFriendsRequest,
  getFriendsSuccess,
  getFriendsFailure,
  followUserSuccess,
  unfollowUserSuccess,
} from "../modules/FollowReducer";

/**
 * 팔로워/팔로잉 통합 목록 조회
 * 응답: [{ userId, nickname, profileImage, bio, isFollowing, isFollower }, ...]
 */
export const getFriendsAPI = () => {
  return async (dispatch) => {
    dispatch(getFriendsRequest());
    try {
      const result = await api.get("/user/scraps/friends");
      if (result.status === 200) {
        dispatch(getFriendsSuccess(result));
      }
    } catch (error) {
      console.error("친구 목록 조회 중 에러가 발생했습니다:", error);
      dispatch(
        getFriendsFailure(error.message || "통신 중 에러가 발생했습니다."),
      );
    }
  };
};

/**
 * 사용자 팔로우 (맞팔로우)
 * @param {string} userId - 팔로우할 대상의 userId
 */
export const followUserAPI = (userId) => {
  return async (dispatch) => {
    try {
      const result = await api.post(`/user/follows/${userId}`);
      if (result.status === 201 || result.status === 200) {
        dispatch(followUserSuccess(userId));
      }
    } catch (error) {
      console.error("팔로우 중 에러가 발생했습니다:", error);
    }
  };
};

/**
 * 사용자 언팔로우
 * @param {string} userId - 언팔로우할 대상의 userId
 */
export const unfollowUserAPI = (userId) => {
  return async (dispatch) => {
    try {
      const result = await api.delete(`/user/follows/${userId}`);
      if (result.status === 204 || result.status === 200) {
        dispatch(unfollowUserSuccess(userId));
      }
    } catch (error) {
      console.error("언팔로우 중 에러가 발생했습니다:", error);
    }
  };
};
