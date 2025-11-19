import { SocialInterface } from '@/shared/interfaces/social.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';

export type ProfileActionType =
  | ((
      | { type: 'edit-name' }
      | { type: 'add-social' }
      | { type: 'edit-social'; item: SocialInterface }
      | { type: 'add-education' }
      | { type: 'edit-education'; item: EducationInterface }
      | { type: 'add-soft-skill' }
      | { type: 'add-hard-skill' }
    ) & { key: string })
  | null;
