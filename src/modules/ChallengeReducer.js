import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
  challenges: [],
  totalCount: 0,
};

/* 액션 */
const GET_CHALLENGES = "challenge/GET_CHALLENGES";

export const {
  challenge: { getChallenges },
} = createActions({
  [GET_CHALLENGES]: (result) => ({
    challenges: result.data.challenges || result.data,
    totalCount: result.data.totalCount || result.data.length,
  }),
});

/* 리듀서 */
const challengeReducer = handleActions(
  {
    [GET_CHALLENGES]: (state, { payload }) => payload,
  },
  initialState,
);

export default challengeReducer;
