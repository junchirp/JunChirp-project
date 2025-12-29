import { useTranslations } from 'next-intl';
import { splitMonths } from './splitMonths';

type Translator = ReturnType<typeof useTranslations>;

export function projectDurationPipe(
  totalMonths: number,
  t: Translator,
): string {
  if (totalMonths <= 0) {
    return t('duration.none');
  }

  const { years, months } = splitMonths(totalMonths);

  const parts: string[] = [];

  if (years > 0) {
    parts.push(t('duration.years', { count: years }));
  }

  if (months > 0) {
    parts.push(t('duration.months', { count: months }));
  }

  return parts.join(' ');
}
