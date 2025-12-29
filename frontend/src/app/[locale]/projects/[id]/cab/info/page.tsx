'use client';

import { ReactElement } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import { membersPipe } from '../../../../../../shared/utils/membersPipe';
import { datePipe } from '@/shared/utils/datePipe';
import { useParams } from 'next/navigation';
import { useGetProjectByIdQuery } from '@/api/projectsApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import ProjectMenu from './ProjectMenu/ProjectMenu';

export default function Info(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useGetProjectByIdQuery(id);
  const user = useAppSelector(authSelector.selectUser);
  const isOwner = !!project && !!user && project.ownerId === user.id;

  return (
    <>
      {project && (
        <div className={styles.info}>
          <div
            className={`
              ${styles['info__image-wrapper']} 
              ${!project.logoUrl ? styles['info__image-wrapper--empty'] : ''}
            `}
          >
            {project.logoUrl ? (
              <Image
                className={styles.info__image}
                src={project.logoUrl}
                alt="logo"
                width={276}
                height={0}
              />
            ) : (
              <Image
                src="/images/empty-image.svg"
                alt="empty-logo"
                width={80}
                height={80}
              />
            )}
          </div>
          <div className={styles.info__details}>
            <div className={styles.info__header}>
              <div className={styles['info__status-wrapper']}>
                <p
                  className={`
                    ${styles.info__status} 
                    ${project.status === 'active' ? styles['info__status--active'] : styles['info__status--done']}
                `}
                >
                  {project.status === 'active' ? 'Активний' : 'Завершений'}
                </p>
                {project.status === 'active' && (
                  <ProjectMenu projectId={project.id} isOwner={isOwner} />
                )}
              </div>
              <h2 className={styles.info__title}>{project.projectName}</h2>
            </div>
            <p className={styles.info__description}>{project.description}</p>
            <p className={styles.info__category}>
              {project.category.categoryName}
            </p>
            <div className={styles.info__team}>
              <div className={styles.info__members}>
                <Image
                  src="/images/users-2.svg"
                  alt="users"
                  width={24}
                  height={24}
                />
                <span className={styles['info__team-text']}>
                  {membersPipe(project.participantsCount)}
                </span>
              </div>
              <span className={styles['info__team-text']}>
                {datePipe(project.createdAt.toString(), 'DD/MM/YYYY')}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
