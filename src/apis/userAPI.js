import api from "./axios";

/** 다른 사용자 공개 프로필 조회 */
export const getPublicProfileAPI = async (userId) => {
  const { data } = await api.get(`/user/profile/${userId}`);
  return data;
};

/** 팔로우 토글 */
export const followUserAPI = async (targetUserCode) => {
  await api.post(`/user/follows/${targetUserCode}`);
};

export const unfollowUserAPI = async (targetUserCode) => {
  await api.delete(`/user/follows/${targetUserCode}`);
};
