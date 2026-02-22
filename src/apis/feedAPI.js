import api from "./axios";
import {
  getFeedListSuccess,
  resetFeedList,
  getFeedDetailSuccess,
  toggleLikeSuccess,
  toggleFollowInFeed,
  getCommentsSuccess,
  addCommentSuccess,
  deleteCommentSuccess,
  getFeaturedSuccess,
  setFeedLoading,
} from "../modules/FeedReducer";

/**
 * 피드 목록 조회 (cursor 기반 무한스크롤)
 * @param {string} type - 피드 타입 (RECOMMENDED, FOLLOWING, 빈 문자열=전체)
 * @param {object|null} cursor - { postCode, score } 또는 null (첫 페이지)
 * @param {number} size - 페이지 크기
 */
export const getFeedListAPI = (type = "RECOMMENDED", cursor = null, size = 10) => {
  return async (dispatch) => {
    dispatch(setFeedLoading(true));
    try {
      const params = new URLSearchParams({ size });
      if (type) params.append("type", type);
      if (cursor) {
        if (cursor.postCode != null) params.append("cursorPostCode", cursor.postCode);
        if (cursor.score != null) params.append("cursorScore", cursor.score);
      }
      const result = await api.get(`/api/feed?${params.toString()}`);
      if (result.status === 200) {
        dispatch(getFeedListSuccess(result));
      }
    } catch (error) {
      console.error("피드 목록 조회 실패:", error);
      dispatch(setFeedLoading(false));
    }
  };
};

/**
 * 피드 목록 초기화 (탭 전환 시)
 */
export const resetFeedListAction = () => {
  return (dispatch) => {
    dispatch(resetFeedList());
  };
};

/**
 * 피드 상세 조회
 */
export const getFeedDetailAPI = (postCode) => {
  return async (dispatch) => {
    dispatch(setFeedLoading(true));
    try {
      const result = await api.get(`/api/feed/${postCode}`);
      if (result.status === 200) {
        dispatch(getFeedDetailSuccess(result));
      }
    } catch (error) {
      console.error("피드 상세 조회 실패:", error);
      dispatch(setFeedLoading(false));
    }
  };
};

/**
 * 피드 등록
 */
export const createFeedPostAPI = (data, files) => {
  return async () => {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    if (files && files.length > 0) {
      files.forEach((f) => formData.append("images", f));
    }
    const result = await api.post("/api/feed", formData);
    return result;
  };
};

/**
 * 피드 삭제
 */
export const deleteFeedPostAPI = (postCode) => {
  return async () => {
    const result = await api.delete(`/api/feed/${postCode}`);
    return result;
  };
};

/**
 * 좋아요 토글
 */
export const toggleLikeAPI = (postCode) => {
  return async (dispatch) => {
    try {
      const result = await api.post(`/api/feed/${postCode}/like`);
      if (result.status === 200) {
        const { liked, likeCount } = result.data;
        dispatch(toggleLikeSuccess(postCode, liked, likeCount));
      }
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };
};

/**
 * 댓글 목록 조회
 */
export const getCommentsAPI = (postCode) => {
  return async (dispatch) => {
    try {
      const result = await api.get(`/api/feed/${postCode}/comments`);
      if (result.status === 200) {
        dispatch(getCommentsSuccess(result));
      }
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
  };
};

/**
 * 댓글 작성
 */
export const addCommentAPI = (postCode, content) => {
  return async (dispatch) => {
    try {
      const result = await api.post(`/api/feed/${postCode}/comments`, {
        content,
      });
      if (result.status === 200 || result.status === 201) {
        dispatch(addCommentSuccess(result.data));
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };
};

/**
 * 댓글 삭제
 */
export const deleteCommentAPI = (commentCode) => {
  return async (dispatch) => {
    try {
      const result = await api.delete(`/api/feed/comments/${commentCode}`);
      if (result.status === 200) {
        dispatch(deleteCommentSuccess(commentCode));
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };
};

/**
 * 추천 피드 조회
 */
export const getFeaturedPostsAPI = (limit = 5) => {
  return async (dispatch) => {
    try {
      const result = await api.get(`/api/feed/featured?limit=${limit}`);
      if (result.status === 200) {
        dispatch(getFeaturedSuccess(result));
      }
    } catch (error) {
      console.error("추천 피드 조회 실패:", error);
    }
  };
};

/**
 * 피드 내 팔로우/언팔로우 토글
 */
export const toggleFollowInFeedAPI = (targetUserCode, currentlyFollowing) => {
  return async (dispatch) => {
    try {
      if (currentlyFollowing) {
        await api.delete(`/user/follows/${targetUserCode}`);
        dispatch(toggleFollowInFeed(targetUserCode, false));
      } else {
        await api.post(`/user/follows/${targetUserCode}`);
        dispatch(toggleFollowInFeed(targetUserCode, true));
      }
    } catch (error) {
      console.error("팔로우 토글 실패:", error);
    }
  };
};

/**
 * 관리자: 추천 토글
 */
export const toggleFeaturedAPI = (postCode) => {
  return async () => {
    try {
      const result = await api.post(`/api/admin/feed/${postCode}/feature`);
      return result.data;
    } catch (error) {
      console.error("추천 토글 실패:", error);
      throw error;
    }
  };
};
