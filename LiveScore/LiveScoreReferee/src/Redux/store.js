import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

export const stores =configureStore({
    reducer : rootReducer
})