'use client';

import { ReactElement } from 'react';
import styles from './ParticipationTooltip.module.scss';
import { useFormatter, useTranslations } from 'next-intl';

interface ParticipationTooltipProps {
  createdAt: Date;
  acceptedAt: Date | null;
  canceledAt: Date | null;
  rejectedAt: Date | null;
  reservedAt: Date | null;
}

export default function ParticipationTooltip({
  createdAt,
  acceptedAt,
  reservedAt,
  canceledAt,
  rejectedAt,
}: ParticipationTooltipProps): ReactElement {
  const format = useFormatter();
  const formattedDate = (date: Date): string =>
    format.dateTime(new Date(date), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  const t = useTranslations('participationsTable');

  return (
    <div className={styles['participation-tooltip']}>
      <div>
        {t('created')} - {formattedDate(createdAt)}
      </div>
      {reservedAt && (
        <div>
          {t('reserved')} - {formattedDate(reservedAt)}
        </div>
      )}
      {acceptedAt && (
        <div>
          {t('accepted')} - {formattedDate(acceptedAt)}
        </div>
      )}
      {rejectedAt && (
        <div>
          {t('rejected')} - {formattedDate(rejectedAt)}
        </div>
      )}
      {canceledAt && (
        <div>
          {t('canceled')} - {formattedDate(canceledAt)}
        </div>
      )}
    </div>
  );
}
