// src/redux/slices/counterSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Song {
    id: string,
    song: string,
    artists: string,
    album: string,
    image: string,
    added: boolean
}

interface Playlist {
  id: string,
  title: string,
  description: string
  songs: Array<Song>
}


interface PlaylistSongs {
    playlists: Playlist[];
}

const initialState: PlaylistSongs = {
    playlists: [
    ],
};
  
const playlistsSlice = createSlice({
    name: 'songs',
    initialState,
    reducers: {
      addPlaylist: (state, action: PayloadAction<Playlist>) => {
        state.playlists.push(action.payload);
      },
    //   removeSong: (state, action: PayloadAction<string>) => {
    //     // Find the index of the song by its id and remove it from the array
    //     const index = state.songs.findIndex((song) => song.id === action.payload);
    //     if (index !== -1) {
    //       state.songs.splice(index, 1);
    //     }
    //   },
      // Other song-related reducers
    },
  });
  
  export const { addPlaylist } = playlistsSlice.actions;
  export default playlistsSlice.reducer;  
  
  
  
  
  
