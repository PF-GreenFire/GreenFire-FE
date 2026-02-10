import {combineReducers} from "redux";
import categoryReducer from "./CategoryReducer";
import scrapbookReducer from "./ScrapbookReducer";
import challengeReducer from "./ChallengeReducer";
import mypageReducer from "./MypageReducer";
import followReducer from "./FollowReducer";

const rootReducer = combineReducers({
    categoryReducer,
    scrapbookReducer,
    challengeReducer,
    mypageReducer,
    followReducer
});

export default rootReducer;