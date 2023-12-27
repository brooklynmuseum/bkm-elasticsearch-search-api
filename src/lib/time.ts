import { zonedTimeToUtc } from 'date-fns-tz';
import { getEnvVar } from './utils';

const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Converts a yyyy-MM-dd date string in the client timezone to UTC
 *
 * @param yyyyMMddDate The yyyy-MM-dd date string to convert
 * @returns The UTC date
 */
export function convertDateToUTC(yyyyMMddDate: string): Date | undefined {
  if (!yyyyMMddDate) return undefined;
  const clientTimeZone = getEnvVar('DEFAULT_TIMEZONE', DEFAULT_TIMEZONE);
  const dateInClientTimezone = new Date(yyyyMMddDate + 'T00:00:00');
  if (isNaN(dateInClientTimezone.getTime())) return undefined;
  return zonedTimeToUtc(dateInClientTimezone, clientTimeZone);
}
