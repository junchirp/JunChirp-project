import { LocalizedOption } from '@/shared/interfaces/localized-option.interface';

export function localizeOptions<T extends LocalizedOption>(
  options: T[],
  t: (key: T['labelKey']) => string,
): (Omit<T, 'labelKey'> & { label: string })[] {
  return options.map(({ labelKey, ...rest }) => ({
    ...rest,
    label: t(labelKey),
  }));
}
