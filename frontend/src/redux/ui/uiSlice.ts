import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  resetUserProjectsKey: number;
  lastUserId: string | null;
}

const initialState: UiState = {
  resetUserProjectsKey: 0,
  lastUserId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    triggerResetUserProjects(state) {
      state.resetUserProjectsKey++;
    },
    setUserPageId(state, action: PayloadAction<string>) {
      if (state.lastUserId !== action.payload) {
        state.resetUserProjectsKey++;
        state.lastUserId = action.payload;
      }
    },
  },
});

export const { triggerResetUserProjects, setUserPageId } = uiSlice.actions;
export default uiSlice.reducer;
