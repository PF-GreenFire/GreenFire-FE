import api from "./axios";
import { getChallenges } from "../modules/ChallengeReducer";

const BASE = "/api/challenges";

export const getChallengesAPI = ({
  page = 0,
  size = 20,
  searchKeyword,
  categoryCode,
} = {}) => {
  return async (dispatch) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (searchKeyword) params.append("searchKeyword", searchKeyword);
    if (categoryCode != null && categoryCode !== "") {
      params.append("categoryCode", String(categoryCode));
    }

    const result = await api.get(`${BASE}?${params.toString()}`);
    if (result.status === 200) {
      dispatch(getChallenges(result));
    }
    return result.data;
  };
};

export const getChallengeDetailAPI = (challengeCode) => {
  return async () => {
    const result = await api.get(`${BASE}/${challengeCode}`);
    return result.data;
  };
};

export const createChallengeAPI = (payload) => {
  return async () => {
    const result = await api.post(BASE, payload);
    const location = result.headers?.location || result.headers?.Location;
    const challengeCode = location
      ? Number(location.split("/").pop())
      : null;
    return { challengeCode };
  };
};

export const updateChallengeAPI = (challengeCode, payload) => {
  return async () => {
    await api.patch(`${BASE}/${challengeCode}`, payload);
  };
};

export const deleteChallengeAPI = (challengeCode) => {
  return async () => {
    await api.delete(`${BASE}/${challengeCode}`);
  };
};

export const applyChallengeAPI = (challengeCode) => {
  return async () => {
    await api.post(`${BASE}/${challengeCode}/apply`);
  };
};

export const cancelChallengeApplyAPI = (challengeCode) => {
  return async () => {
    await api.delete(`${BASE}/${challengeCode}/apply/cancel`);
  };
};

// 챌린지 인증 게시물 목록 (BE: post 도메인의 challenge별 조회)
export const getChallengePostsAPI = (challengeCode) => {
  return async () => {
    const result = await api.get(`/api/post/challenge/${challengeCode}`);
    return result.data; // List<SimplePostDTO>
  };
};
