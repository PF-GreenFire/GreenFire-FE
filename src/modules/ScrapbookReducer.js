import {createActions, handleActions} from "redux-actions";

/* 초기값 */
const initialState = {
    scraps: [],
    loading: false,
    error: null,
    currentCategory: '초록불'
};

/* 액션 타입 */
const GET_SCRAPS_REQUEST = 'scrapbook/GET_SCRAPS_REQUEST';
const GET_SCRAPS_SUCCESS = 'scrapbook/GET_SCRAPS_SUCCESS';
const GET_SCRAPS_FAILURE = 'scrapbook/GET_SCRAPS_FAILURE';
const SET_CATEGORY = 'scrapbook/SET_CATEGORY';
const TOGGLE_SCRAP = 'scrapbook/TOGGLE_SCRAP';

/* 액션 생성자 */
export const { scrapbook: {
    getScrapsRequest,
    getScrapsSuccess,
    getScrapsFailure,
    setCategory,
    toggleScrap
}} = createActions({
    [GET_SCRAPS_REQUEST]: () => ({}),
    [GET_SCRAPS_SUCCESS]: (result) => ({ scraps: result.data }),
    [GET_SCRAPS_FAILURE]: (error) => ({ error }),
    [SET_CATEGORY]: (category) => ({ category }),
    [TOGGLE_SCRAP]: (scrapId) => ({ scrapId })
});

/* 리듀서 */
const scrapbookReducer = handleActions({
    [GET_SCRAPS_REQUEST]: (state) => ({
        ...state,
        loading: true,
        error: null
    }),
    [GET_SCRAPS_SUCCESS]: (state, {payload}) => ({
        ...state,
        scraps: payload.scraps,
        loading: false,
        error: null
    }),
    [GET_SCRAPS_FAILURE]: (state, {payload}) => ({
        ...state,
        loading: false,
        error: payload.error
    }),
    [SET_CATEGORY]: (state, {payload}) => ({
        ...state,
        currentCategory: payload.category
    }),
    [TOGGLE_SCRAP]: (state, {payload}) => ({
        ...state,
        scraps: state.scraps.map(scrap =>
            scrap.id === payload.scrapId
                ? { ...scrap, liked: !scrap.liked }
                : scrap
        )
    })
}, initialState);

export default scrapbookReducer;
