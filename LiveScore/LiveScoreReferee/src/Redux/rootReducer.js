import { combineReducers } from "@reduxjs/toolkit";
import LoginRedux from "./LoginRedux";
import RefereeRedux from "./RefereeRedux";

const rootReducer = combineReducers({
    login: LoginRedux,
    referee: RefereeRedux

})

export default rootReducer;