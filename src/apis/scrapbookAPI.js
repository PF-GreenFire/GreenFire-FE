import api from "./axios";
import {
    getScrapsRequest,
    getScrapsSuccess,
    getScrapsFailure,
    toggleScrap
} from "../modules/ScrapbookReducer";

/**
 * 카테고리별 스크랩 목록 조회
 * @param {string} category - 카테고리 ('초록불', '챌린지', '피드', '친구')
 * @param {object} filters - 필터 옵션 { region: string, search: string, sort: string }
 */
export const getScrapsAPI = (category, filters = {}) => {
    return async (dispatch, getState) => {
        dispatch(getScrapsRequest());

        try {
            // 카테고리별 API 엔드포인트 매핑
            const endpointMap = {
                '초록불': '/v1/scraps/stores',
                '챌린지': '/v1/scraps/challenges',
                '피드': '/v1/scraps/feeds',
                '친구': '/v1/scraps/friends'
            };

            const endpoint = endpointMap[category] || '/v1/scraps/stores';

            // 쿼리 파라미터 구성
            const params = new URLSearchParams();
            if (filters.region && filters.region !== '지역명') {
                params.append('region', filters.region);
            }
            if (filters.search) {
                params.append('search', filters.search);
            }
            if (filters.sort) {
                params.append('sort', filters.sort);
            }

            const queryString = params.toString();
            const url = queryString ? `${endpoint}?${queryString}` : endpoint;

            console.log('getScrapsAPI request:', { category, endpoint: url, filters });

            const result = await api.get(url);

            console.log('getScrapsAPI result:', result.data);

            if (result.status === 200) {
                dispatch(getScrapsSuccess(result));
            }
        } catch (error) {
            console.error("스크랩 목록 조회 중 에러가 발생했습니다:", error);
            dispatch(getScrapsFailure(error.message || "통신 중 에러가 발생했습니다."));
        }
    }
}

/**
 * 스크랩 추가
 * @param {string} category - 카테고리
 * @param {number} itemId - 아이템 ID
 */
export const addScrapAPI = (category, itemId) => {
    return async (dispatch, getState) => {
        try {
            const result = await api.post('/v1/scraps', {
                category,
                itemId
            });

            console.log('addScrapAPI result:', result.data);

            if (result.status === 201) {
                // 스크랩 추가 후 목록 새로고침
                const { scrapbookReducer } = getState();
                dispatch(getScrapsAPI(scrapbookReducer.currentCategory));
            }
        } catch (error) {
            console.error("스크랩 추가 중 에러가 발생했습니다:", error);
        }
    }
}

/**
 * 스크랩 삭제
 * @param {number} scrapId - 스크랩 ID
 */
export const deleteScrapAPI = (scrapId) => {
    return async (dispatch, getState) => {
        try {
            const result = await api.delete(`/v1/scraps/${scrapId}`);

            console.log('deleteScrapAPI result:', result.data);

            if (result.status === 204) {
                // UI 즉시 업데이트 (낙관적 업데이트)
                dispatch(toggleScrap(scrapId));
            }
        } catch (error) {
            console.error("스크랩 삭제 중 에러가 발생했습니다:", error);
        }
    }
}

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
    }
}
