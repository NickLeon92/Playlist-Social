import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface trackState {
  track: string
}
const initialState: trackState = {
    track: '1A7qPfbcyRVEdcZiwTFhZI',
}


const trackSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setTrack: (state, action: PayloadAction<string>) => {
      state.track = action.payload; // Add a new playlist to the array
    },

  }
})

export const {setTrack} = trackSlice.actions
export default trackSlice.reducer