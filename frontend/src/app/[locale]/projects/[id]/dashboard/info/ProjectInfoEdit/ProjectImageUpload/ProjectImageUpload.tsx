'use client';

import { ChangeEvent, ReactElement, useRef, useState } from 'react';
import styles from './ProjectImageUpload.module.scss';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useToast } from '@/hooks/useToast';
import {
  useDeleteProjectLogoMutation,
  useUpdateProjectLogoMutation,
} from '@/api/projectsApi';
import DeleteProjectLogoPopup from './DeleteProjectLogoPopup/DeletePrpjectLogoPopup';
import { useTranslations } from 'next-intl';

const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

interface ProjectImageUploadProps {
  project: ProjectInterface;
}

export default function ProjectImageUpload({
  project,
}: ProjectImageUploadProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast, isActive } = useToast();
  const [updateLogo, { isLoading: updateLoading }] =
    useUpdateProjectLogoMutation();
  const [deleteLogo, { isLoading: deleteLoading }] =
    useDeleteProjectLogoMutation();
  const isLoading = updateLoading || deleteLoading;
  const [isModalOpen, setModalOpen] = useState(false);
  const tImage = useTranslations('projectImage');
  const tButtons = useTranslations('buttons');
  const rules = tImage.raw('rules') as string[];

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (isActive(ToastKeysEnum.UPLOAD_IMAGE)) {
      return;
    }

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const isValidType = allowedTypes.includes(file.type);

    if (!isValidType) {
      showToast({
        severity: 'error',
        summary: tImage('fileTypeError'),
        detail: tImage('fileTypeErrorDetails'),
        actionKey: ToastKeysEnum.UPLOAD_IMAGE,
      });

      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        severity: 'error',
        summary: tImage('fileSizeError'),
        detail: tImage('fileSizeErrorDetails'),
        actionKey: ToastKeysEnum.UPLOAD_IMAGE,
      });

      e.target.value = '';
      return;
    }

    e.target.value = '';

    try {
      await updateLogo({ id: project.id, file }).unwrap();
      showToast({
        severity: 'success',
        summary: tImage('imageUpdateSuccess'),
        actionKey: ToastKeysEnum.UPLOAD_IMAGE,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tImage('imageUpdateError'),
        actionKey: ToastKeysEnum.UPLOAD_IMAGE,
      });
    }
  };

  const deleteProjectLogo = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.UPLOAD_IMAGE)) {
      return;
    }

    try {
      await deleteLogo({ id: project.id });
      closeModal();
      showToast({
        severity: 'success',
        summary: tImage('imageDeleteSuccess'),
        actionKey: ToastKeysEnum.UPLOAD_IMAGE,
      });
    } catch {
      closeModal();
      showToast({
        severity: 'error',
        summary: tImage('imageDeleteError'),
        actionKey: ToastKeysEnum.UPLOAD_IMAGE,
      });
    }
  };

  return (
    <>
      <div className={styles['project-image-upload']}>
        <h6 className={styles['project-image-upload__title']}>
          {tImage('label')}
        </h6>
        <div className={styles['project-image-upload__container']}>
          {project.logo ? (
            <div className={styles['project-image-upload__content-wrapper']}>
              <div className={styles['project-image-upload__image-wrapper']}>
                <Image
                  className={styles['project-image-upload__image']}
                  src={project.logo.url}
                  alt="download"
                  width={project.logo.width}
                  height={project.logo.height}
                />
              </div>
              <div className={styles['project-image-upload__actions']}>
                <Button
                  loading={isLoading}
                  color="green"
                  variant="secondary-frame"
                  fullWidth
                  onClick={openModal}
                >
                  {tButtons('delete')}
                </Button>
                <Button
                  loading={isLoading}
                  color="green"
                  fullWidth
                  onClick={() => inputRef.current?.click()}
                >
                  {tButtons('edit')}
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles['project-image-upload__content-wrapper']}>
              <div className={styles['project-image-upload__content']}>
                <p className={styles['project-image-upload__label']}>
                  {tImage('description')}
                </p>
                <div className={styles['project-image-upload__drop-area']}>
                  <Image
                    src="/images/download-cloud.svg"
                    alt="download"
                    width={80}
                    height={80}
                  />
                </div>
                {rules.map((rule, index) => (
                  <p
                    key={index}
                    className={styles['project-image-upload__rules']}
                  >
                    {rule}
                  </p>
                ))}
              </div>
              <Button
                loading={isLoading}
                color="green"
                fullWidth
                onClick={() => inputRef.current?.click()}
              >
                {tButtons('add')}
              </Button>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(e) => handleChange(e)}
        />
      </div>
      <DeleteProjectLogoPopup
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={deleteProjectLogo}
      />
    </>
  );
}
