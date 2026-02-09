import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
  followers: [],
  following: [],
  activeFilter: "팔로워",
  loading: false,
  error: null,
};

/* 액션 타입 */
const GET_FOLLOWERS_REQUEST = "follow/GET_FOLLOWERS_REQUEST";
const GET_FOLLOWERS_SUCCESS = "follow/GET_FOLLOWERS_SUCCESS";
const GET_FOLLOWERS_FAILURE = "follow/GET_FOLLOWERS_FAILURE";
const GET_FOLLOWING_REQUEST = "follow/GET_FOLLOWING_REQUEST";
const GET_FOLLOWING_SUCCESS = "follow/GET_FOLLOWING_SUCCESS";
const GET_FOLLOWING_FAILURE = "follow/GET_FOLLOWING_FAILURE";
const FOLLOW_USER_SUCCESS = "follow/FOLLOW_USER_SUCCESS";
const UNFOLLOW_USER_SUCCESS = "follow/UNFOLLOW_USER_SUCCESS";
const SET_FOLLOW_FILTER = "follow/SET_FOLLOW_FILTER";

/* 액션 생성자 */
export const {
  follow: {
    getFollowersRequest,
    getFollowersSuccess,
    getFollowersFailure,
    getFollowingRequest,
    getFollowingSuccess,
    getFollowingFailure,
    followUserSuccess,
    unfollowUserSuccess,
    setFollowFilter,
  },
} = createActions({
  [GET_FOLLOWERS_REQUEST]: () => ({}),
  [GET_FOLLOWERS_SUCCESS]: (result) => ({ followers: result.data }),
  [GET_FOLLOWERS_FAILURE]: (error) => ({ error }),
  [GET_FOLLOWING_REQUEST]: () => ({}),
  [GET_FOLLOWING_SUCCESS]: (result) => ({ following: result.data }),
  [GET_FOLLOWING_FAILURE]: (error) => ({ error }),
  [FOLLOW_USER_SUCCESS]: (userId) => ({ userId }),
  [UNFOLLOW_USER_SUCCESS]: (userId) => ({ userId }),
  [SET_FOLLOW_FILTER]: (filter) => ({ filter }),
});

/* 리듀서 */
const followReducer = handleActions(
  {
    [GET_FOLLOWERS_REQUEST]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [GET_FOLLOWERS_SUCCESS]: (state, { payload }) => ({
      ...state,
      followers: payload.followers,
      loading: false,
      error: null,
    }),
    [GET_FOLLOWERS_FAILURE]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [GET_FOLLOWING_REQUEST]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [GET_FOLLOWING_SUCCESS]: (state, { payload }) => ({
      ...state,
      following: payload.following,
      loading: false,
      error: null,
    }),
    [GET_FOLLOWING_FAILURE]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [FOLLOW_USER_SUCCESS]: (state, { payload }) => ({
      ...state,
      followers: state.followers.map((f) =>
        f.userId === payload.userId ? { ...f, isFollowing: true } : f
      ),
      following: state.following.map((f) =>
        f.userId === payload.userId ? { ...f, isFollowing: true } : f
      ),
    }),
    [UNFOLLOW_USER_SUCCESS]: (state, { payload }) => ({
      ...state,
      following: state.following.map((f) =>
        f.userId === payload.userId ? { ...f, isFollowing: false } : f
      ),
      followers: state.followers.map((f) =>
        f.userId === payload.userId ? { ...f, isFollowing: false } : f
      ),
    }),
    [SET_FOLLOW_FILTER]: (state, { payload }) => ({
      ...state,
      activeFilter: payload.filter,
    }),
  },
  initialState
);

export default followReducer;
