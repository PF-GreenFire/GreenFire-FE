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

export const {
  store: { getStores, getStoreCategories, getStoreDetail, getStoreDetailError },
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
});

/* 리듀서 */
const storeReducer = handleActions(
  {
    [GET_STORES]: (state, { payload }) => ({ ...state, ...payload }),
    [GET_STORE_CATEGORIES]: (state, { payload }) => ({ ...state, ...payload }),
    [GET_STORE_DETAIL]: (state, { payload }) => ({ ...state, ...payload }),
    [GET_STORE_DETAIL_ERROR]: (state, { payload }) => ({ ...state, ...payload }),
  },
  initialState,
);

export default storeReducer;
