import api from "./axios";
import {
  getFollowersRequest,
  getFollowersSuccess,
  getFollowersFailure,
  getFollowingRequest,
  getFollowingSuccess,
  getFollowingFailure,
  followUserSuccess,
  unfollowUserSuccess,
} from "../modules/FollowReducer";

/**
 * 나를 팔로우하는 사용자 목록 조회
 * @param {object} filters - { search: string }
 */
export const getFollowersAPI = (filters = {}) => {
  return async (dispatch) => {
    dispatch(getFollowersRequest());
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      const queryString = params.toString();
      const url = queryString
        ? `/v1/follows/followers?${queryString}`
        : "/v1/follows/followers";

      const result = await api.get(url);
      if (result.status === 200) {
        dispatch(getFollowersSuccess(result));
      }
    } catch (error) {
      console.error("팔로워 목록 조회 중 에러가 발생했습니다:", error);
      dispatch(
        getFollowersFailure(error.message || "통신 중 에러가 발생했습니다."),
      );
    }
  };
};

/**
 * 내가 팔로우하는 사용자 목록 조회
 * @param {object} filters - { search: string }
 */
export const getFollowingAPI = (filters = {}) => {
  return async (dispatch) => {
    dispatch(getFollowingRequest());
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      const queryString = params.toString();
      const url = queryString
        ? `/v1/follows/following?${queryString}`
        : "/v1/follows/following";

      const result = await api.get(url);
      if (result.status === 200) {
        dispatch(getFollowingSuccess(result));
      }
    } catch (error) {
      console.error("팔로잉 목록 조회 중 에러가 발생했습니다:", error);
      dispatch(
        getFollowingFailure(error.message || "통신 중 에러가 발생했습니다."),
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
