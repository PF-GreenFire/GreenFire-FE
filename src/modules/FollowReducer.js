import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
  friends: [],
  activeFilter: "팔로워",
  loading: false,
  error: null,
};

/* 액션 타입 */
const GET_FRIENDS_REQUEST = "follow/GET_FRIENDS_REQUEST";
const GET_FRIENDS_SUCCESS = "follow/GET_FRIENDS_SUCCESS";
const GET_FRIENDS_FAILURE = "follow/GET_FRIENDS_FAILURE";
const FOLLOW_USER_SUCCESS = "follow/FOLLOW_USER_SUCCESS";
const UNFOLLOW_USER_SUCCESS = "follow/UNFOLLOW_USER_SUCCESS";
const SET_FOLLOW_FILTER = "follow/SET_FOLLOW_FILTER";

/* 액션 생성자 */
export const {
  follow: {
    getFriendsRequest,
    getFriendsSuccess,
    getFriendsFailure,
    followUserSuccess,
    unfollowUserSuccess,
    setFollowFilter,
  },
} = createActions({
  [GET_FRIENDS_REQUEST]: () => ({}),
  [GET_FRIENDS_SUCCESS]: (result) => ({ friends: result.data }),
  [GET_FRIENDS_FAILURE]: (error) => ({ error }),
  [FOLLOW_USER_SUCCESS]: (userId) => ({ userId }),
  [UNFOLLOW_USER_SUCCESS]: (userId) => ({ userId }),
  [SET_FOLLOW_FILTER]: (filter) => ({ filter }),
});

/* 리듀서 */
const followReducer = handleActions(
  {
    [GET_FRIENDS_REQUEST]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [GET_FRIENDS_SUCCESS]: (state, { payload }) => ({
      ...state,
      friends: payload.friends,
      loading: false,
      error: null,
    }),
    [GET_FRIENDS_FAILURE]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload.error,
    }),
    [FOLLOW_USER_SUCCESS]: (state, { payload }) => ({
      ...state,
      friends: state.friends.map((f) =>
        f.userId === payload.userId ? { ...f, isFollowing: true } : f
      ),
    }),
    [UNFOLLOW_USER_SUCCESS]: (state, { payload }) => ({
      ...state,
      friends: state.friends.map((f) =>
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
