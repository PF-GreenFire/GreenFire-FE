import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
  user: {
    nickname: "",
    profileImage: null,
  },
  scrapbook: {
    greenFire: 0,
    challenge: 0,
    feed: 0,
    friends: 0,
  },
  stats: {
    achievements: 0,
    challenges: 0,
    ecoMemories: 0,
  },
  achievements: [],
  challenges: [],
  memories: [],
  loading: false,
  error: null,
};

/* 액션 타입 */
const GET_MYPAGE_REQUEST = "mypage/GET_MYPAGE_REQUEST";
const GET_MYPAGE_SUCCESS = "mypage/GET_MYPAGE_SUCCESS";
const GET_MYPAGE_FAILURE = "mypage/GET_MYPAGE_FAILURE";

/* 액션 생성자 */
export const {
  mypage: { getMypageRequest, getMypageSuccess, getMypageFailure },
} = createActions({
  [GET_MYPAGE_REQUEST]: () => ({}),
  [GET_MYPAGE_SUCCESS]: (result) => ({ data: result.data }),
  [GET_MYPAGE_FAILURE]: (error) => ({ error }),
});

/* 리듀서 */
const mypageReducer = handleActions(
  {
    [GET_MYPAGE_REQUEST]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [GET_MYPAGE_SUCCESS]: (state, { payload }) => ({
      ...state,
      user: payload.data.user || state.user,
      scrapbook: payload.data.scrapbook || state.scrapbook,
      stats: payload.data.stats || state.stats,
      achievements: payload.data.achievements || state.achievements,
      challenges: payload.data.challenges || state.challenges,
      memories: payload.data.memories || state.memories,
      loading: false,
      error: null,
    }),
    [GET_MYPAGE_FAILURE]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
  },
  initialState
);

export default mypageReducer;
