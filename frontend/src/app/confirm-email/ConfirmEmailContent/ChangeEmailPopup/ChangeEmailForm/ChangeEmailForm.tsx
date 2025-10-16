import { ReactElement } from 'react';
import Input from '@/shared/components/Input/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { useUpdateUserMutation } from '@/api/authApi';
import styles from './ChangeEmailForm.module.scss';
import Button from '@/shared/components/Button/Button';
import { availableEmailSchema } from '@/shared/forms/schemas/availableEmailSchema';

type FormData = z.infer<typeof availableEmailSchema>;

interface FormProps {
  onClose: () => void;
}

export default function ChangeEmailForm({ onClose }: FormProps): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(availableEmailSchema),
    mode: 'onChange',
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { showToast, isActive } = useToast();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (errors.email?.message || isActive('change email')) {
      return;
    }
    const trimmedData = {
      email: data.email.trim(),
    };
    const result = await updateUser(trimmedData);

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'E-mail змінено успішно.',
        detail: 'Перевір пошту для підтвердження.',
        life: 3000,
        actionKey: 'change email',
      });
    } else if ('error' in result) {
      showToast({
        severity: 'error',
        summary: 'Помилка: не вдалося змінити e-mail.',
        detail: 'Спробуй ще раз.',
        life: 3000,
        actionKey: 'change email',
      });
    }

    onClose();
  };

  return (
    <form
      noValidate
      className={styles['change-email-form']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset disabled={isLoading}>
        <Input
          label="Email"
          placeholder="example@email.com"
          type="email"
          {...register('email')}
          withError
          errorMessages={errors.email?.message && [errors.email.message]}
        />
      </fieldset>
      <div className={styles['change-email-form__buttons']}>
        <Button
          color="green"
          variant="secondary-frame"
          type="button"
          fullWidth
          onClick={onClose}
        >
          Назад
        </Button>
        <Button color="green" type="submit" fullWidth>
          Змінити e-mail
        </Button>
      </div>
    </form>
  );
}
