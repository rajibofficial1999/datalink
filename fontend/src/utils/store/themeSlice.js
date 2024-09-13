import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: localStorage.getItem('theme') ?? 'light',
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, value) => {
      state.value = value.payload
      localStorage.setItem('theme', value.payload)
    }
  },
})

export const { changeTheme } = themeSlice.actions

export default themeSlice.reducer
