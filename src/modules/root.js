import {combineReducers} from "redux";
import categoryReducer from "./CategoryReducer";
import scrapbookReducer from "./ScrapbookReducer";
import challengeReducer from "./ChallengeReducer";
import mypageReducer from "./MypageReducer";

const rootReducer = combineReducers({
    categoryReducer,
    scrapbookReducer,
    challengeReducer,
    mypageReducer
});

export default rootReducer;