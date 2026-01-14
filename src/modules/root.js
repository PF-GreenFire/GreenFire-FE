import {combineReducers} from "redux";
import categoryReducer from "./CategoryReducer";
import scrapbookReducer from "./ScrapbookReducer";

const rootReducer = combineReducers({
    categoryReducer,
    scrapbookReducer
});

export default rootReducer;