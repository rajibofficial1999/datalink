import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(sessionStorage.getItem("payload"))?.user ?? null,
  token: JSON.parse(sessionStorage.getItem("payload"))?.token ?? null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload.user;
      sessionStorage.setItem("payload", JSON.stringify(action.payload));
    },
    updateAuthUser: (state, action) => {
      state.user = action.payload;
      let oldUserStoredData = JSON.parse(sessionStorage.getItem("payload"));

      sessionStorage.setItem(
        "payload",
        JSON.stringify({
          ...oldUserStoredData,
          user: action.payload,
        })
      );
    },
    clearAuthUser: (state) => {
      state.user = null;
      sessionStorage.removeItem("payload");
    },
  },
});

export const { setAuthUser, clearAuthUser, updateAuthUser } = authSlice.actions;

export default authSlice.reducer;
