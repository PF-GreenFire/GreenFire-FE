import {combineReducers} from "redux";
import categoryReducer from "./CategoryReducer";
import scrapbookReducer from "./ScrapbookReducer";
import challengeReducer from "./ChallengeReducer";

const rootReducer = combineReducers({
    categoryReducer,
    scrapbookReducer,
    challengeReducer
});

export default rootReducer;