export function datePipe(date: string): string {
  const createdAt = new Date(date);
  const month = String(createdAt.getMonth() + 1).padStart(2, '0');
  const day = String(createdAt.getDate()).padStart(2, '0');

  return `${day}/${month}/${createdAt.getFullYear()}`;
}
