import { RootState } from '@/redux/store';

const selectCsrfToken = (state: RootState): string => state.csrf.token;

const csrfSelector = {
  selectCsrfToken,
};
export default csrfSelector;
