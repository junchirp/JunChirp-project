'use client';

import React, { ReactElement, useEffect } from 'react';
import styles from './TaskForm.module.scss';
import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';
import { TaskStatusWithCountInterface } from '@/shared/interfaces/task-status-with-count.interface';
import { TaskInterface } from '@/shared/interfaces/task.interface';
import {
  taskSchema,
  taskSchemaStatic,
} from '@/shared/forms/schemas/taskSchema';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/shared/components/Input/Input';
import Dropdown from '@/shared/components/Dropdown/Dropdown';
import { taskPriorities } from '@/shared/constants/task-priorities';
import DatePicker from '../DatePicker/DatePicker';
import Button from '@/shared/components/Button/Button';
import Textarea from '@/shared/components/Textarea/Textarea';
import { useShortLocale } from '@/hooks/useShortLocale';
import { useAddTaskMutation } from '@/api/tasksApi';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useToast } from '@/hooks/useToast';

interface TaskFormState {
  members: UserBaseInterface[];
  initialColumnId: string;
  columns: TaskStatusWithCountInterface[];
  initialValues?: TaskInterface;
  onClose: () => void;
  boardId: string;
}

type FormData = z.infer<typeof taskSchemaStatic>;

export default function TaskForm(props: TaskFormState): ReactElement {
  const { members, initialColumnId, columns, initialValues, onClose, boardId } =
    props;
  const assignees = [{ id: null, firstName: '', lastName: '' }, ...members];
  const locale = useShortLocale();
  const tForms = useTranslations('forms');
  const tButtons = useTranslations('buttons');
  const tPriority = useTranslations('taskPriority');
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(taskSchema(tForms)),
    mode: 'onChange',
    defaultValues: {
      taskName: '',
      description: null,
      taskStatusId: initialColumnId,
      priority: 'medium',
      deadline: null,
      assigneeId: null,
    },
  });
  const [createTask, { isLoading }] = useAddTaskMutation();

  useEffect(() => {
    if (initialValues) {
      reset({
        taskName: initialValues.taskName,
        description: initialValues.description,
        taskStatusId: initialValues.taskStatusId,
        priority: initialValues.priority,
        deadline: initialValues.deadline
          ? new Date(initialValues.deadline)
          : null,
        assigneeId: initialValues.assignee.id,
      });
    } else {
      reset({
        taskName: '',
        description: null,
        taskStatusId: initialColumnId,
        priority: 'medium',
        deadline: null,
        assigneeId: null,
      });
    }
  }, [initialValues, initialColumnId, reset]);
  const { showToast, isActive } = useToast();

  const onSubmit = async (data: FormData): Promise<void> => {
    if (isActive(ToastKeysEnum.TASK)) {
      return;
    }

    const trimmedData = {
      ...data,
      taskName: data.taskName.trim(),
      description: data.description?.trim() ? data.description.trim() : null,
    };

    if (initialValues) {
      // TODO: create updateTask method
    } else {
      try {
        await createTask({ data: trimmedData, boardId }).unwrap();
        onClose();

        showToast({
          severity: 'success',
          summary: tForms('taskForm.createSuccess'),
          life: 3000,
          actionKey: ToastKeysEnum.TASK,
        });
      } catch {
        showToast({
          severity: 'error',
          summary: tForms('taskForm.createError'),
          detail: tForms('taskForm.createErrorDetails'),
          life: 3000,
          actionKey: ToastKeysEnum.TASK,
        });
      }
    }
  };

  return (
    <form className={styles['task-form']} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles['task-form__fieldset']}>
        <Input
          label={tForms('taskForm.taskName')}
          placeholder={tForms('taskForm.placeholders.taskName')}
          {...register('taskName')}
          normalize
          required
          withError
          errorMessage={errors.taskName?.message}
        />
        <Textarea
          label={tForms('taskForm.description')}
          placeholder={tForms('taskForm.placeholders.description')}
          {...register('description')}
          normalize
          resize="none"
          height={200}
          withError
          errorMessage={errors.description?.message}
        />
        <Controller
          name="taskStatusId"
          control={control}
          render={({ field }) => (
            <Dropdown
              options={columns}
              label={tForms('taskForm.taskStatus')}
              {...field}
              getOptionLabel={(o) => o.statusName}
              getOptionValue={(o) => o.id}
              withError
            />
          )}
        />
        <Controller
          name="assigneeId"
          control={control}
          render={({ field }) => (
            <Dropdown
              {...field}
              label={tForms('taskForm.members')}
              placeholder={tForms('taskForm.placeholders.members')}
              options={assignees}
              getOptionLabel={(o) =>
                o.id
                  ? `${o.firstName} ${o.lastName}`
                  : tForms('taskForm.placeholders.members')
              }
              getOptionValue={(o) => o.id}
              withError
            />
          )}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Dropdown
              options={taskPriorities}
              label={tForms('taskForm.priority')}
              {...field}
              getOptionLabel={(o) => tPriority(o)}
              getOptionValue={(o) => o}
              withError
            />
          )}
        />
        <Controller
          name="deadline"
          control={control}
          render={({ field }) => (
            <DatePicker
              label={tForms('taskForm.deadline')}
              placeholder={tForms('taskForm.placeholders.deadline')}
              locale={locale}
              {...field}
              withError
            />
          )}
        />
      </fieldset>
      <div className={styles['task-form__actions']}>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {tButtons('cancel')}
        </Button>
        <Button color="green" type="submit" loading={isLoading}>
          {tButtons('save')}
        </Button>
      </div>
    </form>
  );
}
