import api from "./axios";
import { getChallenges } from "../modules/ChallengeReducer";

const ENDPOINTS = {
  all: "/v1/challenges",
  participating: "/v1/challenges/participating",
  created: "/v1/challenges/created",
};

export const getChallengesAPI = (type = "all", params = {}) => {
  return async (dispatch, getState) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append("search", params.search);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.filter) queryParams.append("filter", params.filter);

      const endpoint = ENDPOINTS[type] || ENDPOINTS.all;
      const result = await api.get(`${endpoint}?${queryParams.toString()}`);

      if (result.status === 200) {
        dispatch(getChallenges(result));
      }
    } catch (error) {
      console.error("챌린지 조회 중 에러가 발생했습니다.", error);
    }
  };
};
