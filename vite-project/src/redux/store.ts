import { configureStore } from '@reduxjs/toolkit';
import playlistsSlice from './slices/playlistsSlice';

const store = configureStore({
  reducer: {
    playlists: playlistsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;