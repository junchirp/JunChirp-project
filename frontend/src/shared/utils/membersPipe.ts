export function membersPipe(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) {
    return `${n} учасник`;
  } else if (
    (n % 10 === 2 || n % 10 === 3 || n % 10 === 4) &&
    n % 100 !== 12 &&
    n % 100 !== 13 &&
    n % 100 !== 14
  ) {
    return `${n} учасники`;
  } else {
    return `${n} учасників`;
  }
}
