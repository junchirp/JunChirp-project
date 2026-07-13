import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';
import mainApi from '@/api/mainApi';

export const makeStore = (): EnhancedStore => {
  return configureStore({
    reducer: {
      [mainApi.reducerPath]: mainApi.reducer,
      auth: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          warnAfter: 100,
        },
      }).concat(mainApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
