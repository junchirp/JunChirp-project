'use client';

import { ReactElement } from 'react';
import styles from './ProjectImageUpload.module.scss';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';

interface ProjectImageUploadProps {
  project: ProjectInterface;
}

export default function ProjectImageUpload({
  project,
}: ProjectImageUploadProps): ReactElement {
  return (
    <div className={styles['project-image-upload']}>
      <h6 className={styles['project-image-upload__title']}>
        Зображення проєкту
      </h6>
      <div className={styles['project-image-upload__container']}>
        {project.logoUrl ? (
          <div>2</div>
        ) : (
          <div className={styles['project-image-upload__content-wrapper']}>
            <div className={styles['project-image-upload__content']}>
              <p className={styles['project-image-upload__label']}>
                Завантажити обкладинку проєкту
              </p>
              <div className={styles['project-image-upload__drop-area']}>
                <Image
                  src="/images/download-cloud.svg"
                  alt="download"
                  width={80}
                  height={80}
                />
              </div>
              <p className={styles['project-image-upload__rules']}>
                1. Можливість завантажити зображення розміром до 5 MB.
              </p>
              <p className={styles['project-image-upload__rules']}>
                2. Підтримка форматів: PNG, JPG, JPEG.
              </p>
            </div>
            <Button color="green" fullWidth>
              Додати
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
