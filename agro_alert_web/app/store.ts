import { configureStore } from '@reduxjs/toolkit';
import kullaniciGirisReducer from '@/app/redux/kullaniciGirisSlice';

export const store = configureStore({
  reducer: {
    kullaniciGiris: kullaniciGirisReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;