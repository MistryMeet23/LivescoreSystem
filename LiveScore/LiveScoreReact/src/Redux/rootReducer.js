import { combineReducers } from "@reduxjs/toolkit";
import AdminRedux from "./AdminRedux";
import CoordinatorRedux from "./CoordinatorRedux";
import LoginRedux from "./LoginRedux";

const rootReducer = combineReducers({
    login: LoginRedux,
    coordinator: CoordinatorRedux,
    admin: AdminRedux

})

export default rootReducer;