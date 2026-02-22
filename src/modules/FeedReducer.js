import { createActions, handleActions } from "redux-actions";

const initialState = {
  feedList: {
    posts: [],
    hasMore: true,
    cursor: null, // { score, postCode } or { postCode }
  },
  feedDetail: null,
  comments: [],
  featuredPosts: [],
  loading: false,
  error: null,
};

/* 액션 타입 */
const GET_FEED_LIST_SUCCESS = "feed/GET_FEED_LIST_SUCCESS";
const RESET_FEED_LIST = "feed/RESET_FEED_LIST";
const GET_FEED_DETAIL_SUCCESS = "feed/GET_FEED_DETAIL_SUCCESS";
const TOGGLE_LIKE_SUCCESS = "feed/TOGGLE_LIKE_SUCCESS";
const GET_COMMENTS_SUCCESS = "feed/GET_COMMENTS_SUCCESS";
const ADD_COMMENT_SUCCESS = "feed/ADD_COMMENT_SUCCESS";
const DELETE_COMMENT_SUCCESS = "feed/DELETE_COMMENT_SUCCESS";
const GET_FEATURED_SUCCESS = "feed/GET_FEATURED_SUCCESS";
const TOGGLE_FOLLOW_IN_FEED = "feed/TOGGLE_FOLLOW_IN_FEED";
const SET_FEED_LOADING = "feed/SET_FEED_LOADING";
const SET_FEED_ERROR = "feed/SET_FEED_ERROR";

/* 액션 생성자 */
export const {
  feed: {
    getFeedListSuccess,
    resetFeedList,
    getFeedDetailSuccess,
    toggleLikeSuccess,
    toggleFollowInFeed,
    getCommentsSuccess,
    addCommentSuccess,
    deleteCommentSuccess,
    getFeaturedSuccess,
    setFeedLoading,
    setFeedError,
  },
} = createActions({
  [GET_FEED_LIST_SUCCESS]: (result) => ({ data: result.data }),
  [RESET_FEED_LIST]: () => ({}),
  [GET_FEED_DETAIL_SUCCESS]: (result) => ({ data: result.data }),
  [TOGGLE_LIKE_SUCCESS]: (postCode, liked, likeCount) => ({
    postCode,
    liked,
    likeCount,
  }),
  [TOGGLE_FOLLOW_IN_FEED]: (targetUserCode, isFollowing) => ({
    targetUserCode,
    isFollowing,
  }),
  [GET_COMMENTS_SUCCESS]: (result) => ({ data: result.data }),
  [ADD_COMMENT_SUCCESS]: (comment) => ({ comment }),
  [DELETE_COMMENT_SUCCESS]: (commentCode) => ({ commentCode }),
  [GET_FEATURED_SUCCESS]: (result) => ({ data: result.data }),
  [SET_FEED_LOADING]: (loading) => ({ loading }),
  [SET_FEED_ERROR]: (error) => ({ error }),
});

/* 리듀서 */
const feedReducer = handleActions(
  {
    [GET_FEED_LIST_SUCCESS]: (state, { payload }) => {
      const newPosts = payload.data.content || [];
      const existingCodes = new Set(state.feedList.posts.map(p => p.postCode));
      const uniqueNew = newPosts.filter(p => !existingCodes.has(p.postCode));

      // cursor 정보 구성
      const cursor = payload.data.nextCursorPostCode
        ? {
            postCode: payload.data.nextCursorPostCode,
            score: payload.data.nextCursorScore ?? null,
          }
        : state.feedList.cursor;

      return {
        ...state,
        feedList: {
          posts: [...state.feedList.posts, ...uniqueNew],
          hasMore: payload.data.hasMore,
          cursor,
        },
        loading: false,
      };
    },
    [RESET_FEED_LIST]: (state) => ({
      ...state,
      feedList: { posts: [], hasMore: true, cursor: null },
    }),
    [GET_FEED_DETAIL_SUCCESS]: (state, { payload }) => ({
      ...state,
      feedDetail: payload.data,
      loading: false,
    }),
    [TOGGLE_LIKE_SUCCESS]: (state, { payload }) => ({
      ...state,
      feedList: {
        ...state.feedList,
        posts: state.feedList.posts.map((post) =>
          post.postCode === payload.postCode
            ? { ...post, liked: payload.liked, likeCount: payload.likeCount }
            : post
        ),
      },
      feedDetail:
        state.feedDetail?.postCode === payload.postCode
          ? {
              ...state.feedDetail,
              liked: payload.liked,
              likeCount: payload.likeCount,
            }
          : state.feedDetail,
    }),
    [TOGGLE_FOLLOW_IN_FEED]: (state, { payload }) => ({
      ...state,
      feedList: {
        ...state.feedList,
        posts: state.feedList.posts.map((post) =>
          post.userCode === payload.targetUserCode
            ? { ...post, isFollowing: payload.isFollowing }
            : post
        ),
      },
      feedDetail:
        state.feedDetail?.userCode === payload.targetUserCode
          ? { ...state.feedDetail, isFollowing: payload.isFollowing }
          : state.feedDetail,
    }),
    [GET_COMMENTS_SUCCESS]: (state, { payload }) => ({
      ...state,
      comments: payload.data || [],
    }),
    [ADD_COMMENT_SUCCESS]: (state, { payload }) => ({
      ...state,
      comments: [...state.comments, payload.comment],
    }),
    [DELETE_COMMENT_SUCCESS]: (state, { payload }) => ({
      ...state,
      comments: state.comments.filter(
        (c) => c.commentCode !== payload.commentCode
      ),
    }),
    [GET_FEATURED_SUCCESS]: (state, { payload }) => ({
      ...state,
      featuredPosts: payload.data || [],
    }),
    [SET_FEED_LOADING]: (state, { payload }) => ({
      ...state,
      loading: payload.loading,
    }),
    [SET_FEED_ERROR]: (state, { payload }) => ({
      ...state,
      error: payload.error,
      loading: false,
    }),
  },
  initialState
);

export default feedReducer;
