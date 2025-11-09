import { RootState } from '@/redux/store';
import { AuthInterface } from '@/shared/interfaces/auth.interface';

const selectUser = (state: RootState): AuthInterface | null => state.auth.user;
const selectLoadingStatus = (state: RootState): 'loading' | 'loaded' | 'idle' =>
  state.auth.loadingStatus;

const authSelector = {
  selectUser,
  selectLoadingStatus,
};
export default authSelector;
