import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { AuthInterface } from '@/shared/interfaces/auth.interface';

interface AuthState {
  user: AuthInterface | null;
  loadingStatus: 'loading' | 'loaded' | 'idle';
}

const initialState: AuthState = {
  user: null,
  loadingStatus: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.register.matchPending, (state) => {
      state.loadingStatus = 'loading';
    });
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loadingStatus = 'loaded';
      },
    );
    builder.addMatcher(authApi.endpoints.register.matchRejected, (state) => {
      state.user = null;
      state.loadingStatus = 'loaded';
    });
    builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
      state.loadingStatus = 'loading';
    });
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loadingStatus = 'loaded';
      },
    );
    builder.addMatcher(authApi.endpoints.login.matchRejected, (state) => {
      state.user = null;
      state.loadingStatus = 'loaded';
    });
    builder.addMatcher(authApi.endpoints.getMe.matchPending, (state) => {
      state.loadingStatus = 'loading';
    });
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loadingStatus = 'loaded';
      },
    );
    builder.addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
      state.user = null;
      state.loadingStatus = 'loaded';
    });
    builder.addMatcher(
      (action) =>
        authApi.endpoints.logout.matchFulfilled(action) ||
        authApi.endpoints.logout.matchRejected(action),
      (state) => {
        state.user = null;
        state.loadingStatus = 'loaded';
      },
    );
    builder.addMatcher(
      authApi.endpoints.updateUser.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loadingStatus = 'loaded';
      },
    );
    builder.addMatcher(
      authApi.endpoints.updateEmail.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loadingStatus = 'loaded';
      },
    );
    builder.addMatcher(
      authApi.endpoints.confirmEmail.matchFulfilled,
      (state) => {
        state.user = null;
        state.loadingStatus = 'loaded';
      },
    );
    builder.addMatcher(
      authApi.endpoints.confirmEmail.matchRejected,
      (state, action) => {
        const error = action.payload;

        if (error?.status === 401) {
          state.user = null;
        }

        state.loadingStatus = 'loaded';
      },
    );
  },
});

// export const {} = authSlice.actions;
export default authSlice.reducer;
