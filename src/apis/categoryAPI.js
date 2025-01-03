import api from "./axios";
import {getCategories} from "../modules/CategoryReducer";

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
