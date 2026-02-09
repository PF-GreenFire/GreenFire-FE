import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
  user: {
    nickname: "",
    profileImage: null,
  },
  userInfo: {
    nickname: "",
    userId: "",
    name: "",
    email: "",
    birth: "",
    phone: "",
    profileImage: null,
  },
  scrapbook: {
    greenFireCount: 0,
    challengeCount: 0,
    feedCount: 0,
    friendCount: 0,
    greenfires: [],
    challenges: [],
    feeds: [],
  },
  achievementSummary: {
    achievements: [],
    totalCount: 0,
  },
  challengeSummary: {
    challenges: [],
    totalCount: 0,
  },
  echoMemorySummary: {
    echoMemories: [],
    totalCount: 0,
  },
  loading: false,
  error: null,
};

/* 액션 타입 */
// 마이페이지 메인
const GET_MYPAGE_REQUEST = "mypage/GET_MYPAGE_REQUEST";
const GET_MYPAGE_SUCCESS = "mypage/GET_MYPAGE_SUCCESS";
const GET_MYPAGE_FAILURE = "mypage/GET_MYPAGE_FAILURE";

// 사용자 정보 조회
const GET_USER_INFO_REQUEST = "mypage/GET_USER_INFO_REQUEST";
const GET_USER_INFO_SUCCESS = "mypage/GET_USER_INFO_SUCCESS";
const GET_USER_INFO_FAILURE = "mypage/GET_USER_INFO_FAILURE";

// 사용자 정보 수정
const UPDATE_USER_INFO_REQUEST = "mypage/UPDATE_USER_INFO_REQUEST";
const UPDATE_USER_INFO_SUCCESS = "mypage/UPDATE_USER_INFO_SUCCESS";
const UPDATE_USER_INFO_FAILURE = "mypage/UPDATE_USER_INFO_FAILURE";

// 비밀번호 변경
const CHANGE_PASSWORD_REQUEST = "mypage/CHANGE_PASSWORD_REQUEST";
const CHANGE_PASSWORD_SUCCESS = "mypage/CHANGE_PASSWORD_SUCCESS";
const CHANGE_PASSWORD_FAILURE = "mypage/CHANGE_PASSWORD_FAILURE";

// 회원 탈퇴
const WITHDRAW_USER_REQUEST = "mypage/WITHDRAW_USER_REQUEST";
const WITHDRAW_USER_SUCCESS = "mypage/WITHDRAW_USER_SUCCESS";
const WITHDRAW_USER_FAILURE = "mypage/WITHDRAW_USER_FAILURE";

// 상태 초기화
const CLEAR_USER_INFO = "mypage/CLEAR_USER_INFO";
const CLEAR_ERROR = "mypage/CLEAR_ERROR";

/* 액션 생성자 */
export const {
  mypage: {
    // 마이페이지 메인
    getMypageRequest,
    getMypageSuccess,
    getMypageFailure,
    // 사용자 정보 조회
    getUserInfoRequest,
    getUserInfoSuccess,
    getUserInfoFailure,
    // 사용자 정보 수정
    updateUserInfoRequest,
    updateUserInfoSuccess,
    updateUserInfoFailure,
    // 비밀번호 변경
    changePasswordRequest,
    changePasswordSuccess,
    changePasswordFailure,
    // 회원 탈퇴
    withdrawUserRequest,
    withdrawUserSuccess,
    withdrawUserFailure,
    // 상태 초기화
    clearUserInfo,
    clearError,
  },
} = createActions({
  // 마이페이지 메인
  [GET_MYPAGE_REQUEST]: () => ({}),
  [GET_MYPAGE_SUCCESS]: (result) => ({ data: result.data }),
  [GET_MYPAGE_FAILURE]: (error) => ({ error }),

  // 사용자 정보 조회
  [GET_USER_INFO_REQUEST]: () => ({}),
  [GET_USER_INFO_SUCCESS]: (result) => ({ data: result.data }),
  [GET_USER_INFO_FAILURE]: (error) => ({ error }),

  // 사용자 정보 수정
  [UPDATE_USER_INFO_REQUEST]: () => ({}),
  [UPDATE_USER_INFO_SUCCESS]: (result) => ({ data: result.data }),
  [UPDATE_USER_INFO_FAILURE]: (error) => ({ error }),

  // 비밀번호 변경
  [CHANGE_PASSWORD_REQUEST]: () => ({}),
  [CHANGE_PASSWORD_SUCCESS]: () => ({}),
  [CHANGE_PASSWORD_FAILURE]: (error) => ({ error }),

  // 회원 탈퇴
  [WITHDRAW_USER_REQUEST]: () => ({}),
  [WITHDRAW_USER_SUCCESS]: () => ({}),
  [WITHDRAW_USER_FAILURE]: (error) => ({ error }),

  // 상태 초기화
  [CLEAR_USER_INFO]: () => ({}),
  [CLEAR_ERROR]: () => ({}),
});

/* 리듀서 */
const mypageReducer = handleActions(
  {
    // 마이페이지 메인
    [GET_MYPAGE_REQUEST]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [GET_MYPAGE_SUCCESS]: (state, { payload }) => ({
      ...state,
      user: payload.data.user || state.user,
      scrapbook: payload.data.scrapbook || state.scrapbook,
      achievementSummary:
        payload.data.achievementSummary || state.achievementSummary,
      challengeSummary: payload.data.challengeSummary || state.challengeSummary,
      echoMemorySummary:
        payload.data.echoMemorySummary || state.echoMemorySummary,
      loading: false,
      error: null,
    }),
    [GET_MYPAGE_FAILURE]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),

    // 사용자 정보 조회
    [GET_USER_INFO_REQUEST]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [GET_USER_INFO_SUCCESS]: (state, { payload }) => ({
      ...state,
      userInfo: payload.data,
      loading: false,
      error: null,
    }),
    [GET_USER_INFO_FAILURE]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),

    // 사용자 정보 수정
    [UPDATE_USER_INFO_REQUEST]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [UPDATE_USER_INFO_SUCCESS]: (state, { payload }) => ({
      ...state,
      userInfo: payload.data,
      user: {
        ...state.user,
        profileImage: payload.data.profileImage,
        nickname: payload.data.nickname,
      },
      loading: false,
      error: null,
    }),
    [UPDATE_USER_INFO_FAILURE]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),

    // 비밀번호 변경
    [CHANGE_PASSWORD_REQUEST]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [CHANGE_PASSWORD_SUCCESS]: (state) => ({
      ...state,
      loading: false,
      error: null,
    }),
    [CHANGE_PASSWORD_FAILURE]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),

    // 회원 탈퇴
    [WITHDRAW_USER_REQUEST]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [WITHDRAW_USER_SUCCESS]: (state) => ({
      ...state,
      userInfo: initialState.userInfo,
      loading: false,
      error: null,
    }),
    [WITHDRAW_USER_FAILURE]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),

    // 상태 초기화
    [CLEAR_USER_INFO]: (state) => ({
      ...state,
      userInfo: initialState.userInfo,
    }),
    [CLEAR_ERROR]: (state) => ({
      ...state,
      error: null,
    }),
  },
  initialState,
);

export default mypageReducer;
