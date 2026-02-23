import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
  stores: [],
  totalCount: 0,
};

/* 액션 */
const GET_STORES = "store/GET_STORES";

export const {
  store: { getStores },
} = createActions({
  [GET_STORES]: (result) => ({
    stores: result.data.stores || result.data,
    totalCount: result.data.totalCount || result.data.length,
  }),
});

/* 리듀서 */
const storeReducer = handleActions(
  {
    [GET_STORES]: (state, { payload }) => payload,
  },
  initialState,
);

export default storeReducer;
