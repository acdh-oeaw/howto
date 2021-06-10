/**
 * Provides resource publish date.
 */
export function getDate(date: string | Date | undefined): Date | null {
  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
  if (date == null) return null
  if (date instanceof Date) return date
  if (typeof date === 'string' && date.length === 0) return null
  return new Date(date)
}
