import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
  stores: [],
  totalCount: 0,
  storeCategories: [],
  storeDetail: null,
  storeDetailError: null,
};

/* 액션 */
const GET_STORES = "store/GET_STORES";
const GET_STORE_CATEGORIES = "store/GET_STORE_CATEGORIES";
const GET_STORE_DETAIL = "store/GET_STORE_DETAIL";
const GET_STORE_DETAIL_ERROR = "store/GET_STORE_DETAIL_ERROR";
const TOGGLE_STORE_LIKE = "store/TOGGLE_STORE_LIKE";

export const {
  store: { getStores, getStoreCategories, getStoreDetail, getStoreDetailError, toggleStoreLike },
} = createActions({
  [GET_STORES]: (result) => ({
    stores: result.data.stores || result.data,
    totalCount: result.data.totalCount || result.data.length,
  }),
  [GET_STORE_CATEGORIES]: (result) => ({
    storeCategories: result.data,
  }),
  [GET_STORE_DETAIL]: (result) => ({
    storeDetail: result.data,
    storeDetailError: null,
  }),
  [GET_STORE_DETAIL_ERROR]: () => ({
    storeDetail: null,
    storeDetailError: true,
  }),
  [TOGGLE_STORE_LIKE]: (storeCode) => ({ storeCode }),
});

/* 리듀서 */
const storeReducer = handleActions(
  {
    [GET_STORES]: (state, { payload }) => ({ ...state, ...payload }),
    [GET_STORE_CATEGORIES]: (state, { payload }) => ({ ...state, ...payload }),
    [GET_STORE_DETAIL]: (state, { payload }) => ({ ...state, ...payload }),
    [GET_STORE_DETAIL_ERROR]: (state, { payload }) => ({ ...state, ...payload }),
    [TOGGLE_STORE_LIKE]: (state, { payload }) => {
      const { storeCode } = payload;
      const toggleLike = (item) => ({
        ...item,
        liked: !item.liked,
        likeCount: item.liked ? item.likeCount - 1 : item.likeCount + 1,
      });

      const newState = { ...state };

      // stores 배열 업데이트
      newState.stores = state.stores.map((store) =>
        store.storeCode === storeCode ? toggleLike(store) : store,
      );

      // storeDetail 업데이트
      if (state.storeDetail && state.storeDetail.storeCode === storeCode) {
        newState.storeDetail = toggleLike(state.storeDetail);
      }

      return newState;
    },
  },
  initialState,
);

export default storeReducer;
