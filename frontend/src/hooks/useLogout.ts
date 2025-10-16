'use client';

import { useLogoutMutation } from '@/api/authApi';
import { useAppDispatch } from './reduxHooks';
import mainApi from '@/api/mainApi';
import { setEducations } from '@/redux/educations/educationsSlice';
import { setSoftSkills } from '@/redux/softSkills/softSkillsSlice';
import { setHardSkills } from '@/redux/hardSkills/hardSkillsSlice';
import { setSocials } from '@/redux/socials/socialsSlice';

export function useLogout(): { logout: () => void } {
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();

  const logout = (): void => {
    logoutMutation(undefined);
    dispatch(
      mainApi.util.invalidateTags([
        'auth',
        'my-projects',
        'my-requests-in-projects',
        'requests-in-my-projects',
        'invites-me-in-projects',
        'invites-in-my-projects',
        { type: 'user-projects', id: 'LIST' },
      ]),
    );
    dispatch(setEducations([]));
    dispatch(setSoftSkills([]));
    dispatch(setHardSkills([]));
    dispatch(setSocials([]));
  };

  return { logout };
}
