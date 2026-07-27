/**
 * Generates the first available name based on `baseName`.
 *
 * `items` must contain only names equal to `baseName`
 * or in the format `${baseName} N`.
 */

export function generateUniqName<T>(
  items: T[],
  nameSelector: (item: T) => string,
  baseName: string,
): string {
  const used = new Set<number>();

  for (const item of items) {
    const name = nameSelector(item);

    if (name === baseName) {
      used.add(1);
      continue;
    }

    const suffix = name.slice(baseName.length + 1);
    const number = Number(suffix);

    if (Number.isInteger(number) && number >= 2) {
      used.add(number);
    }
  }

  let n = 1;

  while (used.has(n)) {
    n++;
  }

  return n === 1 ? baseName : `${baseName} ${n}`;
}
