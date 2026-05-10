import { RootState } from '@/redux/store';
import { AuthInterface } from '@/shared/interfaces/auth.interface';

const selectUser = (state: RootState): AuthInterface | null => state.auth.user;
const selectLoadingStatus = (state: RootState): 'loading' | 'loaded' | 'idle' =>
  state.auth.loadingStatus;
const selectRequiredUser = (state: RootState): AuthInterface => {
  const user = selectUser(state);

  if (!user) {
    throw new Error('User is required in protected context');
  }

  return user;
};

const authSelector = {
  selectUser,
  selectLoadingStatus,
  selectRequiredUser,
};
export default authSelector;
