import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface tokenState {
  token: string
}
const initialState: tokenState = {
    token: 'BQA501Da7UgFdQjLS3In9XPItUrf6SytK151jM2wfjxZAz5y2g9yH9nTQ4JpB4BPkXIJLj-FSz1iDwwU73SiQqzai3SW3Q1c57U5w4U8UJSZEul2AIt_Q3aSIZLA9yqIwooxrGECsPtMV2MXSBmd63pEazwble5RCJtrDTdfSnJDYu1qk6XAUC2Zscpg0TJDwpX0YSClMbVgBuLB0EyTjisBeotBL4onmA',
}


const tokenSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload; // Add a new playlist to the array
    },

  }
})

export const {setToken} = tokenSlice.actions
export default tokenSlice.reducer