import {createActions, handleActions} from "redux-actions";

/* 초기값 */
const initialState = {};

/* 액션 */
const GET_CATEGORIES = 'category/GET_CATEGORIES';

export const { category : {getCategories}} = createActions({
    [GET_CATEGORIES] : result => ({ categories : result.data }),
});

/* 리듀서 */
const categoryReducer = handleActions({
    [GET_CATEGORIES] : (state, {payload}) => payload,
}, initialState);

export default categoryReducer;