import { RootState } from '@/redux/store';

const selectResetUserProjectsKey = (state: RootState): number => state.ui;

const uiSelector = {
  selectResetUserProjectsKey,
};
export default uiSelector;
