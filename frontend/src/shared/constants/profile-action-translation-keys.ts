import { ProfileActionType } from '../types/profile-action.type';

export const profileActionTranslationKeys: Record<
  NonNullable<ProfileActionType>['type'],
  string
> = {
  'edit-name': 'actions.editName',
  'add-social': 'actions.addSocial',
  'edit-social': 'actions.editSocial',
  'add-education': 'actions.addEducation',
  'edit-education': 'actions.editEducation',
  'add-soft-skill': 'actions.addSoftSkill',
  'add-hard-skill': 'actions.addHardSkill',
};
