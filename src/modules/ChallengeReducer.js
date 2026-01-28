import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
  challenges: [],
  totalCount: 0,
};

/* 액션 */
const GET_ALL_CHALLENGES = "challenge/GET_ALL_CHALLENGES";
const GET_PARTICIPATING_CHALLENGES = "challenge/GET_PARTICIPATING_CHALLENGES";
const GET_MY_CREATED_CHALLENGES = "challenge/GET_MY_CREATED_CHALLENGES";

export const {
  challenge: {
    getAllChallenges,
    getParticipatingChallenges,
    getMyCreatedChallenges,
  },
} = createActions({
  [GET_ALL_CHALLENGES]: (result) => ({
    challenges: result.data.challenges || result.data,
    totalCount: result.data.totalCount || result.data.length,
  }),
  [GET_PARTICIPATING_CHALLENGES]: (result) => ({
    challenges: result.data.challenges || result.data,
    totalCount: result.data.totalCount || result.data.length,
  }),
  [GET_MY_CREATED_CHALLENGES]: (result) => ({
    challenges: result.data.challenges || result.data,
    totalCount: result.data.totalCount || result.data.length,
  }),
});

/* 리듀서 */
const challengeReducer = handleActions(
  {
    [GET_ALL_CHALLENGES]: (state, { payload }) => payload,
    [GET_PARTICIPATING_CHALLENGES]: (state, { payload }) => payload,
    [GET_MY_CREATED_CHALLENGES]: (state, { payload }) => payload,
  },
  initialState,
);

export default challengeReducer;
