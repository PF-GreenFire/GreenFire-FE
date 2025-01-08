import {createActions, handleActions} from "redux-actions";

/* 초기값 */
const initialState = {};

/* 액션 */
const GET_CATEGORIES = 'category/GET_CATEGORIES';
const SUCCESS = 'category/SUCCESS';

export const { category : {getCategories, success}} = createActions({
    [GET_CATEGORIES] : result => ({ categories : result.data }),
    [SUCCESS] : () => ({ success : true })
});

/* 리듀서 */
const categoryReducer = handleActions({
    [GET_CATEGORIES] : (state, {payload}) => payload,
    [SUCCESS] : (state, {payload}) => payload
}, initialState);

export default categoryReducer;