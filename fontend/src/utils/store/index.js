import { configureStore } from '@reduxjs/toolkit'
import themeSlice from "./themeSlice.js";
import authSlice from "./authSlice.js";

export const store = configureStore({
  reducer: {
    theme : themeSlice,
    auth : authSlice,
  },
})
