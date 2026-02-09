import api from "./axios";
import {
  getScrapsRequest,
  getScrapsSuccess,
  getScrapsFailure,
  toggleScrap,
} from "../modules/ScrapbookReducer";

/**
 * 카테고리별 스크랩 목록 조회
 * @param {string} category - 카테고리 ('greenfire', 'challenge', 'feed', 'friend')
 */
export const getScrapsAPI = (category) => {
  return async (dispatch) => {
    dispatch(getScrapsRequest());

    try {
      const endpointMap = {
        greenfire: "/user/scraps/stores",
        challenge: "/user/scraps/challenges",
        feed: "/user/scraps/feeds",
        friend: "/user/scraps/friends",
      };

      const endpoint = endpointMap[category] || "/user/scraps/stores";

      console.log("getScrapsAPI request:", { category, endpoint });

      const result = await api.get(endpoint);

      console.log("getScrapsAPI result:", result.data);

      if (result.status === 200) {
        dispatch(getScrapsSuccess(result));
      }
    } catch (error) {
      console.error("스크랩 목록 조회 중 에러가 발생했습니다:", error);
      dispatch(
        getScrapsFailure(error.message || "통신 중 에러가 발생했습니다."),
      );
    }
  };
};

/**
 * 스크랩 추가
 * @param {string} category - 카테고리
 * @param {number} itemId - 아이템 ID
 */
export const addScrapAPI = (category, itemId) => {
  return async (dispatch, getState) => {
    try {
      const result = await api.post("/v1/scraps", {
        category,
        itemId,
      });

      console.log("addScrapAPI result:", result.data);

      if (result.status === 201) {
        // 스크랩 추가 후 목록 새로고침
        const { scrapbookReducer } = getState();
        dispatch(getScrapsAPI(scrapbookReducer.currentCategory));
      }
    } catch (error) {
      console.error("스크랩 추가 중 에러가 발생했습니다:", error);
    }
  };
};

/**
 * 스크랩 삭제
 * @param {number} scrapId - 스크랩 ID
 */
export const deleteScrapAPI = (scrapId) => {
  return async (dispatch, getState) => {
    try {
      const result = await api.delete(`/v1/scraps/${scrapId}`);

      console.log("deleteScrapAPI result:", result.data);

      if (result.status === 204) {
        // UI 즉시 업데이트 (낙관적 업데이트)
        dispatch(toggleScrap(scrapId));
      }
    } catch (error) {
      console.error("스크랩 삭제 중 에러가 발생했습니다:", error);
    }
  };
};

/**
 * 스크랩 토글 (추가/삭제)
 * @param {string} category - 카테고리
 * @param {number} itemId - 아이템 ID
 * @param {boolean} isScraped - 현재 스크랩 상태
 */
export const toggleScrapAPI = (category, itemId, isScraped) => {
  return async (dispatch) => {
    if (isScraped) {
      // 이미 스크랩된 경우 삭제
      dispatch(deleteScrapAPI(itemId));
    } else {
      // 스크랩 추가
      dispatch(addScrapAPI(category, itemId));
    }
  };
};
