import { RootState } from '../store';

const selectResetUserProjectsKey = (state: RootState): number => state.ui;

const uiSelector = {
  selectResetUserProjectsKey
};
export default uiSelector;
