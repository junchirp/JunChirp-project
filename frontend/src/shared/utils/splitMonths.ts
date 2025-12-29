export function splitMonths(totalMonths: number): {
  years: number;
  months: number;
} {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months };
}
