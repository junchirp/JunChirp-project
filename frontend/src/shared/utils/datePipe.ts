type DateFormatType = 'DD/MM/YYYY' | 'DD.MM.YYYY';

export function datePipe(date: string, format?: DateFormatType): string {
  const createdAt = new Date(date);
  const month = String(createdAt.getMonth() + 1).padStart(2, '0');
  const day = String(createdAt.getDate()).padStart(2, '0');

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${createdAt.getFullYear()}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${createdAt.getFullYear()}`;
    default:
      return date;
  }
}
