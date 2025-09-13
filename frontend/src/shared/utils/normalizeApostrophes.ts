export const normalizeApostrophes = (value: string): string =>
  value.replace(
    /[\u2019\u2018\u201B\u2032\u02B9\uFF07\u0060\u00B4\u02BC]/g,
    `'`,
  );
