'use client';

import { ReactElement } from 'react';
import styles from './InviteForm.module.scss';
import ProjectDropdown from '@/shared/components/ProjectDropdown/ProjectDropdown';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProjectRoleDropdown from '@/shared/components/ProjectRoleDropdown/ProjectRoleDropdown';
import Button from '@/shared/components/Button/Button';
import { z } from 'zod';
import { useInviteUserMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { ProjectCardInterface } from '../../../interfaces/project-card.interface';
import { inviteSchema } from '../../../forms/schemas/inviteSchema';

type FormData = z.infer<typeof inviteSchema>;

interface InviteFormProps {
  user: UserCardInterface;
  myProjects: ProjectCardInterface[];
  onClose: () => void;
}

export default function InviteForm(props: InviteFormProps): ReactElement {
  const { user, onClose, myProjects } = props;
  const [inviteUser] = useInviteUserMutation();
  const { showToast, isActive } = useToast();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(inviteSchema),
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
  const allowedRoleTypeIds = user.educations.map(
    (edu) => edu.specialization.id,
  );

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('invite user')) {
      return;
    }

    const result = await inviteUser(data);

    if ('data' in result) {
      onClose();
      showToast({
        severity: 'success',
        summary: 'Запрошення надіслано.',
        life: 3000,
        actionKey: 'invite user',
      });
    } else if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося надіслати запрошення.',
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
            <ProjectDropdown
              {...field}
              options={myProjects}
              label="Проєкт"
              placeholder="Обери проєкт"
              onChange={(value) => {
                field.onChange(value);
                setValue('projectRoleId', '');
              }}
            />
          )}
        />
        <Controller
          name="projectRoleId"
          control={control}
          render={({ field }) => (
            <ProjectRoleDropdown
              {...field}
              options={roleOptions}
              label="Роль"
              placeholder={
                selectedProject ? 'Обери роль' : 'Спочатку обери проєкт'
              }
              disabled={!selectedProject}
              allowedRoleTypeIds={allowedRoleTypeIds}
            />
          )}
        />
      </fieldset>
      <div className={styles['invite-form__actions']}>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          Скасувати
        </Button>
        <Button type="submit" color="green" disabled={!isValid}>
          Запросити
        </Button>
      </div>
    </form>
  );
}
