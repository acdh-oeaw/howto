/**
 * Provides resource publish date.
 */
export function getDate(date: Date | string | undefined): Date | null {
	if (date == null) return null;
	if (date instanceof Date) return date;
	if (typeof date === "string" && date.length === 0) return null;
	return new Date(date);
}
