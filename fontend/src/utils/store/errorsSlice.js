import { createSlice } from '@reduxjs/toolkit';

export const errorsSlice = createSlice({
  name: 'errors',
  initialState: {
    value: {}
  },
  reducers: {
    addErrors: (state, action) => {
      console.log(action.payload)
      // state.value = action.payload;
    },
  },
});

export const { addErrors } = errorsSlice.actions;

export default errorsSlice.reducer;
