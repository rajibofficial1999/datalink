import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    value: {},
  },
  reducers: {
    addNotification: (state, action) => {
      console.log(action.payload);

      state.value = action.payload;
    },
  },
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
