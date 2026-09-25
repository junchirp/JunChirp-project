export const normalizeUrl = (value: string): string => {
  if (!value) {
    return value;
  }

  return /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;
};
