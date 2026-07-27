import { LocaleType } from '../types/locale.type';

const COPY_SUFFIXES = {
  ua: {
    first: ' (копія)',
    numbered: (number: number) => ` (копія ${number})`,
  },
  en: {
    first: ' (copy)',
    numbered: (number: number) => ` (copy ${number})`,
  },
} as const;

export function generateCopyName(
  boardName: string,
  locale: LocaleType,
  existingNames: Set<string>,
): string {
  const { first, numbered } = COPY_SUFFIXES[locale];

  const firstCopyName = `${boardName}${first}`;

  if (!existingNames.has(firstCopyName)) {
    return firstCopyName;
  }

  let copyNumber = 2;

  while (existingNames.has(`${boardName}${numbered(copyNumber)}`)) {
    copyNumber++;
  }

  return `${boardName}${numbered(copyNumber)}`;
}
