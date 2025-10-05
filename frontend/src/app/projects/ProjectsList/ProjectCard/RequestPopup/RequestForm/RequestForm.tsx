'use client';

import { ReactElement } from 'react';
import styles from './RequestForm.module.scss';
import { z } from 'zod';
import { requestSchema } from '../../../../../../shared/forms/schemas/requestSchema';
import { ProjectCardInterface } from '../../../../../../shared/interfaces/project-card.interface';
import { Controller, useForm } from 'react-hook-form';
import ProjectRoleDropdown from '../../../../../../shared/components/ProjectRoleDropdown/ProjectRoleDropdown';
import Button from '../../../../../../shared/components/Button/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteSchema } from '../../../../../../shared/forms/schemas/inviteSchema';
import { useAppSelector } from '../../../../../../hooks/reduxHooks';
import authSelector from '../../../../../../redux/auth/authSelector';
import { useCreateRequestMutation } from '../../../../../../api/participationsApi';
import { useToast } from '../../../../../../hooks/useToast';
import Textarea from '../../../../../../shared/components/Textarea/Textarea';

type FormData = z.infer<typeof requestSchema>;

interface RequestFormProps {
  onClose: () => void;
  project: ProjectCardInterface;
}

export default function RequestForm(props: RequestFormProps): ReactElement {
  const { project, onClose } = props;
  const [createRequest] = useCreateRequestMutation();
  const { showToast, isActive } = useToast();
  const user = useAppSelector(authSelector.selectUser);
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(inviteSchema),
    mode: 'onChange',
    defaultValues: {
      projectId: project.id,
      projectRoleId: '',
      userId: user?.id ?? '',
    },
  });
  const roleOptions = project?.roles.filter((role) => !role.user) ?? [];
  const allowedRoleTypeIds =
    user?.educations.map((edu) => edu.specialization.id) ?? [];

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive('request')) {
      return;
    }

    const result = await createRequest(data);

    if ('data' in result) {
      onClose();
      showToast({
        severity: 'success',
        summary: 'Запит на участь в проєкті надіслано успішно!',
        life: 3000,
        actionKey: 'request',
      });
    } else if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося надіслати заявку.',
        detail: 'Спробуй пізніше.',
        life: 3000,
        actionKey: 'request',
      });
    }
  };

  return (
    <form className={styles['request-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles['request-form__fieldset']}>
        <Controller
          name="projectRoleId"
          control={control}
          render={({ field }) => (
            <ProjectRoleDropdown
              {...field}
              options={roleOptions}
              label="Роль"
              placeholder="Обери роль"
              disabled={false}
              allowedRoleTypeIds={allowedRoleTypeIds}
            />
          )}
        />
        <Textarea
          label="Коментар (необов'язково)"
          placeholder="Коротко розкажи, чому хочеш приєднатися саме до цього проєкту"
        />
      </fieldset>
      <div className={styles['request-form__actions']}>
        <Button color="red" onClick={onClose}>
          Скасувати
        </Button>
        <Button type="submit" color="green" disabled={!isValid}>
          Подати заявку
        </Button>
      </div>
    </form>
  );
}
