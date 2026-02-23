import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
  stores: [],
  totalCount: 0,
  storeCategories: [],
};

/* 액션 */
const GET_STORES = "store/GET_STORES";
const GET_STORE_CATEGORIES = "store/GET_STORE_CATEGORIES";

export const {
  store: { getStores, getStoreCategories },
} = createActions({
  [GET_STORES]: (result) => ({
    stores: result.data.stores || result.data,
    totalCount: result.data.totalCount || result.data.length,
  }),
  [GET_STORE_CATEGORIES]: (result) => ({
    storeCategories: result.data,
  }),
});

/* 리듀서 */
const storeReducer = handleActions(
  {
    [GET_STORES]: (state, { payload }) => ({ ...state, ...payload }),
    [GET_STORE_CATEGORIES]: (state, { payload }) => ({ ...state, ...payload }),
  },
  initialState,
);

export default storeReducer;
