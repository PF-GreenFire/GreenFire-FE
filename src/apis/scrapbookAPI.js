import api from "./axios";
import {
  getScrapsRequest,
  getScrapsSuccess,
  getScrapsFailure,
  toggleScrap,
} from "../modules/ScrapbookReducer";

// FE 카테고리 → BE ScrapTargetType 매핑
const CATEGORY_TO_TARGET_TYPE = {
  greenfire: "STORE",
  challenge: "CHALLENGE",
  feed: "POST",
  friend: "USER",
};

/**
 * 카테고리별 스크랩 목록 조회
 * @param {string} category - 'greenfire' | 'challenge' | 'feed' | 'friend'
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
      const result = await api.get(endpoint);

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
 * @param {string} category - FE 카테고리 ('greenfire' 등)
 * @param {number|string} itemId - 대상 아이템 ID (store_code, post_code, UUID 등)
 */
export const addScrapAPI = (category, itemId) => {
  return async (dispatch, getState) => {
    const targetType = CATEGORY_TO_TARGET_TYPE[category];
    if (!targetType) {
      console.error("addScrapAPI: 알 수 없는 카테고리", category);
      return;
    }

    try {
      const result = await api.post("/user/scraps", {
        targetType,
        targetCode: String(itemId),
      });

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
 * @param {number} scrapCode - scrap 테이블 PK
 */
export const deleteScrapAPI = (scrapCode) => {
  return async (dispatch) => {
    try {
      const result = await api.delete(`/user/scraps/${scrapCode}`);

      if (result.status === 204) {
        // UI 즉시 업데이트 (낙관적 업데이트)
        dispatch(toggleScrap(scrapCode));
      }
    } catch (error) {
      console.error("스크랩 삭제 중 에러가 발생했습니다:", error);
    }
  };
};

/**
 * 스크랩 토글 (추가/삭제)
 * @param {string} category
 * @param {number|string} itemId - 추가 시 대상 id, 삭제 시 scrapCode (스크랩 list 응답의 scrapCode 그대로 전달)
 * @param {boolean} isScraped - 현재 스크랩 상태
 */
export const toggleScrapAPI = (category, itemId, isScraped) => {
  return async (dispatch) => {
    if (isScraped) {
      // 이미 스크랩된 경우 삭제 (itemId 는 scrapCode 여야 함)
      dispatch(deleteScrapAPI(itemId));
    } else {
      // 스크랩 추가 (itemId 는 대상 도메인의 PK)
      dispatch(addScrapAPI(category, itemId));
    }
  };
};
