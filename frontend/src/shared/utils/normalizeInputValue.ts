export const normalizeInputValue = (value: string): string =>
  value
    .replace(/[\u2019\u2018\u201B\u2032\u02B9\uFF07\u0060\u00B4\u02BC]/g, `'`)
    .replace(
      /[\u201C\u201D\u201E\u201F\u00AB\u00BB\u2033\u2036\u275D\u275E]/g,
      `"`,
    )
    .replace(/ {2,}/g, ' ')
    .replace(/'{2,}/g, `'`);
