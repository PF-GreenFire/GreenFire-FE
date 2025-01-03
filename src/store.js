import {createStore, applyMiddleware} from 'redux';
import rootReducer from "./modules/root";

const store =  createStore(
    rootReducer,
    applyMiddleware(thunk, logger)
);

export default store;