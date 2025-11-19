'use client';

import { ReactElement } from 'react';
import { ProfileActionType } from '@/shared/types/profile-action.type';
import styles from './ProfileActionForm.module.scss';
import SocialForm from './SocialForm/SocialForm';
import EducationForm from './EducationForm/EducationForm';
import SoftSkillForm from './SoftSkillForm/SoftSkillForm';
import HardSkillForm from './HardSkillForm/HardSkillForm';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import UserNameForm from './UserNameForm/UserNameForm';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface ProfileActionFormProps {
  action: ProfileActionType;
  allField: boolean;
  user: AuthInterface;
  onCancel: () => void;
}

export default function ProfileActionForm(
  props: ProfileActionFormProps,
): ReactElement {
  const { action, allField, onCancel, user } = props;
  const t = useTranslations('profile.actions');
  let content: ReactElement;
  switch (action?.type) {
    case 'add-social': {
      content = <SocialForm onCancel={onCancel} />;
      break;
    }
    case 'edit-social': {
      content = <SocialForm initialValues={action.item} onCancel={onCancel} />;
      break;
    }
    case 'add-education': {
      content = <EducationForm onCancel={onCancel} />;
      break;
    }
    case 'edit-education': {
      content = (
        <EducationForm initialValues={action.item} onCancel={onCancel} />
      );
      break;
    }
    case 'add-soft-skill': {
      content = <SoftSkillForm onCancel={onCancel} />;
      break;
    }
    case 'add-hard-skill': {
      content = <HardSkillForm onCancel={onCancel} />;
      break;
    }
    case 'edit-name': {
      content = <UserNameForm initialValues={user} onCancel={onCancel} />;
      break;
    }
    default: {
      content = allField ? (
        <p className={styles['profile-action-form__text']}>
          {t('full.firstFragment')}
          <Link
            className={styles['profile-action-form__link']}
            href={'/projects'}
          >
            {t('full.firstLink')}
          </Link>
          {t('full.secondFragment')}
          <Link
            className={styles['profile-action-form__link']}
            href={'/new-project'}
          >
            {t('full.secondLink')}
          </Link>
          !
        </p>
      ) : (
        <p className={styles['profile-action-form__text']}>{t('empty')}</p>
      );
    }
  }

  return <div className={styles['profile-action-form']}>{content}</div>;
}
