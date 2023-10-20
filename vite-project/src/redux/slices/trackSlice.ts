import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song } from './playlistsSlice';

interface trackState {
  track: string
  playlist: Array<Song>
}
const initialState: trackState = {
    track: '1A7qPfbcyRVEdcZiwTFhZI',
    playlist: []
}


const trackSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    setTrack: (state, action: PayloadAction<string>) => {
      state.track = action.payload; // Add a new playlist to the array
    },
    setCurrentPlaylist: (state, action:  PayloadAction<Song[]>) => {
      state.playlist = action.payload
    }

  }
})

export const {setTrack , setCurrentPlaylist} = trackSlice.actions
export default trackSlice.reducer