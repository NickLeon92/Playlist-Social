import { configureStore } from '@reduxjs/toolkit';
import playlistsSlice from './slices/playlistsSlice';
import trackSlice from './slices/trackSlice';
import tokenSlice from './slices/tokenSlice';

const store = configureStore({
  reducer: {
    playlists: playlistsSlice,
    token: tokenSlice,
    track: trackSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;