import { format } from 'date-fns';

/**
 * Formats a date string (YYYY-MM-DD) to display format (MMM D, YYYY)
 */
export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString + 'T00:00:00');
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Gets today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Formats duration for display with proper singular/plural
 */
export function formatDuration(duration: string | undefined): string {
  if (!duration) return '';
  
  const days = parseInt(duration);
  if (isNaN(days)) return '';
  
  if (days === 1) return '1 day';
  return `${days} days`;
}