// src/redux/slices/counterSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Song {
  id: string,
  song: string,
  artists: string,
  album: string,
  image: string,
  added: boolean,
  songId: string
}

export interface Playlist {
  id: string,
  title: string,
  description: string
  songs: Array<Song>
}

interface PlaylistsState {
  playlists: Playlist[]
}

const initialState: PlaylistsState = {
  playlists: [],
}

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlists.push(action.payload); // Add a new playlist to the array
    },
    removePlaylist: (state, action: PayloadAction<string>) => {
      console.log('removing playlist with id: ', action.payload)
      // console.log(JSON.parse(JSON.stringify(state)))
      const updatedPlaylists = state.playlists.filter((el) => {
        if (el.id !== action.payload) {
          return el
        }
      })
      state.playlists = updatedPlaylists
    },
    updatePlaylist: (state, action : PayloadAction<Playlist>) => {
      const updatedPlaylists = state.playlists.map((el) => {
        if(el.id === action.payload.id){
          return action.payload
        }
        return el
      })
      state.playlists = updatedPlaylists
    },
    setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists = action.payload
    }
  }
})

export const { addPlaylist, removePlaylist, updatePlaylist, setPlaylists } = playlistsSlice.actions
export default playlistsSlice.reducer
// export interface Playlist