import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: false,
  error: null
}

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    LoginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    LoginSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    LoginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }

  },
})

export const { LoginStart, LoginSuccess, LoginFail } = loginSlice.actions;
export default loginSlice.reducer;