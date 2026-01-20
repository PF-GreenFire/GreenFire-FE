import api from "./axios";
import { getAllChallenges, getParticipatingChallenges, getMyCreatedChallenges } from "../modules/ChallengeReducer";

// 전체 챌린지 가져오기
export const getAllChallengesAPI = (params = {}) => {
  return async (dispatch, getState) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.filter) queryParams.append('filter', params.filter);

      const result = await api.get(`/v1/challenges?${queryParams.toString()}`);

      console.log("getAllChallengesAPI result : ", result.data);

      if (result.status === 200) {
        dispatch(getAllChallenges(result));
      }
    } catch (error) {
      console.error("전체 챌린지 조회 중 에러가 발생했습니다.", error);
    }
  };
};

// 참여중인 챌린지 가져오기
export const getParticipatingChallengesAPI = (params = {}) => {
  return async (dispatch, getState) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);

      const result = await api.get(`/v1/challenges/participating?${queryParams.toString()}`);

      console.log("getParticipatingChallengesAPI result : ", result.data);

      if (result.status === 200) {
        dispatch(getParticipatingChallenges(result));
      }
    } catch (error) {
      console.error("참여중인 챌린지 조회 중 에러가 발생했습니다.", error);
    }
  };
};

// 내가 만든 챌린지 가져오기
export const getMyCreatedChallengesAPI = (params = {}) => {
  return async (dispatch, getState) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);

      const result = await api.get(`/v1/challenges/created?${queryParams.toString()}`);

      console.log("getMyCreatedChallengesAPI result : ", result.data);

      if (result.status === 200) {
        dispatch(getMyCreatedChallenges(result));
      }
    } catch (error) {
      console.error("내가 만든 챌린지 조회 중 에러가 발생했습니다.", error);
    }
  };
};
