'use client';

import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import styles from './ParticipationsTable.module.scss';
import { Link, usePathname } from '@/i18n/routing';
import Button from '@/shared/components/Button/Button';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { useTranslations } from 'next-intl';
import ParticipationStatusTooltip from '@/shared/components/ParticipationsTable/ParticipationStatusTooltip/ParticipationStatusTooltip';
import Tooltip from '@/shared/components/Tooltip/Tooltip';
import ProjectTooltip from '@/shared/components/ParticipationsTable/ProjectTooltip/ProjectTooltip';

interface ParticipationsTableProps {
  items: ProjectParticipationInterface[];
  page: number;
  limit: number;
  openModal?: (item: ProjectParticipationInterface) => void;
  accept?: (item: ProjectParticipationInterface) => void;
  cancel?: (item: ProjectParticipationInterface) => void;
  isLoading: boolean;
  actionColumnWidth: number;
}

export default function ParticipationsTable(
  props: ParticipationsTableProps,
): ReactElement {
  const {
    items,
    page,
    limit,
    openModal,
    accept,
    isLoading,
    actionColumnWidth,
    cancel,
  } = props;
  const tTable = useTranslations('participationsTable');
  const tButtons = useTranslations('buttons');
  const cancelEvent = openModal ?? cancel;
  const pathname = usePathname();
  const isProfilePage = pathname === '/profile';
  const projectLinkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const resizeObserver = useRef<ResizeObserver | null>(null);

  const [truncatedProjects, setTruncatedProjects] = useState<Set<string>>(
    new Set(),
  );

  const checkTruncation = useCallback((): void => {
    setTruncatedProjects((previous) => {
      const next = new Set<string>();

      projectLinkRefs.current.forEach((element, id) => {
        if (element.scrollWidth > element.clientWidth) {
          next.add(id);
        }
      });

      if (
        previous.size === next.size &&
        [...previous].every((id) => next.has(id))
      ) {
        return previous;
      }

      return next;
    });
  }, []);

  const observeProjectLink = useCallback(
    (id: string, element: HTMLAnchorElement | null): void => {
      const previousElement = projectLinkRefs.current.get(id);
      if (previousElement) {
        resizeObserver.current?.unobserve(previousElement);
      }
      if (element) {
        projectLinkRefs.current.set(id, element);
        resizeObserver.current?.observe(element);
      } else {
        projectLinkRefs.current.delete(id);
      }
      checkTruncation();
    },
    [checkTruncation],
  );

  useEffect(() => {
    const observer = new ResizeObserver(checkTruncation);
    resizeObserver.current = observer;
    projectLinkRefs.current.forEach((element) => {
      observer.observe(element);
    });
    checkTruncation();
    return (): void => {
      observer.disconnect();
      resizeObserver.current = null;
    };
  }, [items, checkTruncation]);

  return (
    <table className={styles['participations-table']}>
      <colgroup>
        <col className={styles['participations-table__col-first']} />
        <col className={styles['participations-table__col-auto']} />
        <col className={styles['participations-table__col-auto']} />
        <col className={styles['participations-table__col-auto']} />
        <col style={{ width: `${actionColumnWidth}px` }} />
      </colgroup>
      <thead>
        <tr className={styles['participations-table__row--header']}>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
            scope="col"
          >
            {tTable('colFirst')}
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
            scope="col"
          >
            {tTable('colProject')}
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
            scope="col"
          >
            {tTable('colRole')}
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
            scope="col"
          >
            {tTable('colStatus')}
          </th>
          <th
            className={`${styles['participations-table__cell']} ${styles['participations-table__cell--header']}`}
            scope="col"
          >
            {tTable('colActions')}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          const totalIndex = (page - 1) * limit + index + 1;
          const projectName = item.projectRole.project.projectName;
          const projectLink = (
            <Link
              className={styles['participations-table__link']}
              href={
                isProfilePage
                  ? `/projects/${item.projectRole.project.id}`
                  : `/projects/${item.projectRole.project.id}/dashboard/team`
              }
              target={isProfilePage ? '_blank' : undefined}
              ref={(element) => observeProjectLink(item.id, element)}
            >
              {projectName}
            </Link>
          );

          return (
            <tr key={item.id} className={styles['participations-table__row']}>
              <td
                className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
              >
                {totalIndex < 10 ? `0${totalIndex}` : `${totalIndex}`}
              </td>
              <td
                className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
              >
                {truncatedProjects.has(item.id) ? (
                  <Tooltip
                    content={<ProjectTooltip projectName={projectName} />}
                  >
                    {projectLink}
                  </Tooltip>
                ) : (
                  projectLink
                )}
              </td>
              <td
                className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
              >
                {item.projectRole.roleType.roleName}
              </td>
              <td
                className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
              >
                <Tooltip
                  content={
                    <ParticipationStatusTooltip
                      createdAt={item.createdAt}
                      acceptedAt={item.acceptedAt}
                      canceledAt={item.canceledAt}
                      rejectedAt={item.rejectedAt}
                      reservedAt={item.reservedAt}
                    />
                  }
                >
                  <span>{tTable(item.status)}</span>
                </Tooltip>
              </td>
              <td
                className={`${styles['participations-table__cell']} ${styles['participations-table__cell--body']}`}
              >
                {(item.status === 'pending' || item.status === 'reserved') && (
                  <div className={styles['participations-table__actions']}>
                    {accept ? (
                      <>
                        <Button
                          variant="link"
                          size="ssm"
                          color="gray-2"
                          onClick={() => cancelEvent?.(item)}
                        >
                          {tButtons('decline')}
                        </Button>{' '}
                        /{' '}
                        <Button
                          variant="link"
                          size="ssm"
                          color="green"
                          loading={isLoading}
                          onClick={() => accept(item)}
                        >
                          {tButtons('accept')}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="link"
                        size="ssm"
                        color="gray-2"
                        onClick={() => cancelEvent?.(item)}
                      >
                        {tButtons('cancel')}
                      </Button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
