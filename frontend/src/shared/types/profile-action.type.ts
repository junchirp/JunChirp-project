import { SocialInterface } from '@/shared/interfaces/social.interface';
import { EducationInterface } from '@/shared/interfaces/education.interface';
import { SoftSkillInterface } from '@/shared/interfaces/soft-skill.interface';
import { HardSkillInterface } from '@/shared/interfaces/hard-skill.interface';

export type ProfileActionType =
  | ((
      | { type: 'edit-name' }
      | { type: 'add-social' }
      | { type: 'edit-social'; item: SocialInterface }
      | { type: 'add-education' }
      | { type: 'edit-education'; item: EducationInterface }
      | { type: 'add-soft-skill' }
      | { type: 'edit-soft-skill'; item: SoftSkillInterface }
      | { type: 'add-hard-skill' }
      | { type: 'edit-hard-skill'; item: HardSkillInterface }
    ) & { key: string })
  | null;
