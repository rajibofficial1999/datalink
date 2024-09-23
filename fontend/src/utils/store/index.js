import { configureStore } from '@reduxjs/toolkit'
import themeSlice from "./themeSlice.js";
import authSlice from "./authSlice.js";
import messageSlice from "./messageSlice.js";

export const store = configureStore({
  reducer: {
    theme : themeSlice,
    auth : authSlice,
    message : messageSlice
  },
})
