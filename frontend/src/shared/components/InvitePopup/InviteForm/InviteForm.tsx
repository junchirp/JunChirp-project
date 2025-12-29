'use client';

import { ReactElement } from 'react';
import styles from './InviteForm.module.scss';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/shared/components/Button/Button';
import { z } from 'zod';
import { useInviteUserMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import {
  inviteSchema,
  inviteSchemaStatic,
} from '@/shared/forms/schemas/inviteSchema';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { RoleWithUserInterface } from '@/shared/interfaces/role-with-user.interface';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/routing';

type FormData = z.infer<typeof inviteSchemaStatic>;

interface InviteFormProps {
  user: UserCardInterface;
  myProjects: ProjectCardInterface[];
  onClose: () => void;
}

export default function InviteForm(props: InviteFormProps): ReactElement {
  const { user, onClose, myProjects } = props;
  const [inviteUser, { isLoading }] = useInviteUserMutation();
  const { showToast, isActive } = useToast();
  const locale = useLocale();
  const tForm = useTranslations('forms');
  const tButtons = useTranslations('buttons');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(inviteSchema(tForm)),
    mode: 'onChange',
    defaultValues: {
      projectId: '',
      projectRoleId: '',
      userId: user.id,
    },
  });

  const selectedProjectId = useWatch({
    control,
    name: 'projectId',
  });
  const selectedProject = myProjects.find(
    (item) => item.id === selectedProjectId,
  );
  const roleOptions = selectedProject?.roles.filter((role) => !role.user) ?? [];
  const allowedRoleTypeIds = user.desiredRoles.map((role) => role.id);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('invite user')) {
      return;
    }

    const result = await inviteUser({ ...data, locale: locale as Locale });

    if ('data' in result) {
      onClose();
      showToast({
        severity: 'success',
        summary: tForm('inviteForm.success'),
        life: 3000,
        actionKey: 'invite user',
      });
    } else if ('error' in result) {
      showToast({
        severity: 'error',
        summary: tForm('inviteForm.error'),
        detail: tForm('inviteForm.errorDetails'),
        life: 3000,
        actionKey: 'invite user',
      });
    }
  };

  return (
    <form className={styles['invite-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles['invite-form__fieldset']}>
        <Controller
          name="projectId"
          control={control}
          render={({ field }) => (
            <Dropdown<ProjectCardInterface>
              {...field}
              options={myProjects}
              label={tForm('inviteForm.project')}
              placeholder={tForm('inviteForm.placeholders.project')}
              onChange={(value) => {
                field.onChange(value);
                setValue('projectRoleId', '');
              }}
              getOptionLabel={(o) => o.projectName}
              getOptionValue={(o) => o.id}
            />
          )}
        />
        <Controller
          name="projectRoleId"
          control={control}
          render={({ field }) => (
            <Dropdown<RoleWithUserInterface>
              {...field}
              options={roleOptions}
              label={tForm('inviteForm.role')}
              placeholder={tForm('inviteForm.placeholders.role')}
              disabled={!selectedProject}
              getOptionLabel={(o) => o.roleType.roleName}
              getOptionValue={(o) => o.id}
              isOptionDisabled={(o) =>
                !allowedRoleTypeIds.includes(o.roleType.id)
              }
            />
          )}
        />
      </fieldset>
      <div className={styles['invite-form__actions']}>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {tButtons('cancel')}
        </Button>
        <Button
          type="submit"
          color="green"
          disabled={!isValid}
          loading={isLoading}
        >
          {tButtons('invite')}
        </Button>
      </div>
    </form>
  );
}
