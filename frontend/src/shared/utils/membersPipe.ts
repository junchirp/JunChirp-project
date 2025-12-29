import { useTranslations } from 'next-intl';

type Translator = ReturnType<typeof useTranslations>;

export function membersPipe(n: number, t: Translator): string {
  return t('members', { count: n });
}
