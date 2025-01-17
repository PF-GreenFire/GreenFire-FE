import api from "./axios";
import {getCategories, success} from "../modules/CategoryReducer";

export const getCategoriesAPI = (categoryType) => {
    return async (dispatch, getState) => {
        try {
            const result = await api.get(
                `/v1/category?categoryType=${categoryType}`
            );

            console.log('getCategoriesAPI result : ', result.data);

            if(result.status === 200) {
                dispatch(getCategories(result));
            }
        } catch {
            console.error("통신 중 에러가 발생했습니다.");
        }
    }
}

export const deleteCategoryAPI = (categoryType, categoryId) => {
    return async (dispatch, getState) => {
        try {
            const result = await api.delete(
                `/v1/category/${categoryId}`,
                {
                    params: {categoryType}
                }
            );

            console.log('deleteCategoryAPI result : ', result.data);

            if(result.status === 204) {
                dispatch(success());
            }
        } catch {
            console.error("통신 중 에러가 발생했습니다.");
        }
    }
}