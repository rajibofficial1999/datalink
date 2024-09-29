import { configureStore } from '@reduxjs/toolkit'
import themeSlice from "./themeSlice.js";
import authSlice from "./authSlice.js";
import messageSlice from "./messageSlice.js";
import errorsSlice from "./errorsSlice.js";

export const store = configureStore({

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['errors/addErrors'],
        ignoredPaths: ['errors.value'],
      },
    }),
  reducer: {
    theme : themeSlice,
    auth : authSlice,
    message : messageSlice,
    errors: errorsSlice
  },
})
