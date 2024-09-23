import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: null,
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.value = action.payload;
    },
    clearMessage: (state) => {
      state.value = null;
    },
  },
});

export const { addMessage, clearMessage } = messageSlice.actions;

export default messageSlice.reducer;
