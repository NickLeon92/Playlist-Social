import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface tokenData {
  access_token: string
  refresh_token: string
  expTime: Date
}

interface tokenState {
  token: tokenData
}
const initialState: tokenState = {
    token: {
      access_token: '',
      refresh_token: '',
      expTime: new Date()
    },
}


const tokenSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      // console.log(action)
      state.token.access_token = action.payload; // Add a new playlist to the array
    },
    setRefresh: (state, action: PayloadAction<string>) => {
      // console.log(action)
      state.token.refresh_token = action.payload; // Add a new playlist to the array
    },
    setExpiration: (state, action: PayloadAction<Date>) => {
      // console.log(action)
      state.token.expTime = action.payload; // Add a new playlist to the array
    }
  }
})

export const {setToken, setRefresh, setExpiration} = tokenSlice.actions
export default tokenSlice.reducer