'use client';

import { ReactElement } from 'react';
import { useFormatter } from 'next-intl';

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

  return (
    <div>
      <div>Надіслано - {formattedDate(createdAt)}</div>
      {reservedAt && <div>В резерві - {formattedDate(reservedAt)}</div>}
      {acceptedAt && <div>Прийнято - {formattedDate(acceptedAt)}</div>}
      {rejectedAt && <div>Відхилено - {formattedDate(rejectedAt)}</div>}
      {canceledAt && <div>Відмінено - {formattedDate(canceledAt)}</div>}
    </div>
  );
}
