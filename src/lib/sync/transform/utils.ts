import type { JsonData, ElasticsearchDocument } from '@/types';
import { toPlainText } from '@portabletext/toolkit';

/**
 * Assigns a value to a key in a JSON object if the value is neither undefined nor null.
 *
 * @param {JsonData} obj - The object to be updated.
 * @param {string} key - The key in the object to be set.
 * @param {any} value - The value to set for the key.
 */
export function setIfHasValue(obj: JsonData, key: string, value: any) {
  if (value !== undefined && value !== null) {
    obj[key] = value;
  }
}

/**
 * Since we're using two fields for dates (date and year), we need to make sure they're both set.
 * Sets either the start or end date and year.
 *
 * @param {ElasticsearchDocument} obj - The JSON object to be modified.
 * @param {string} value - The date string to be parsed.
 * @param {string} type - Specifies whether to set the 'start' or 'end' date and year.
 */
export function setDateAndYear(
  obj: ElasticsearchDocument,
  value: string,
  type: 'start' | 'end',
): void {
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    obj[`${type}Date`] = date.toISOString();
    obj[`${type}Year`] = date.getFullYear();
  }
}

/**
 * Splits a comma-separated string into an array of trimmed strings.
 *
 * @param {string} s - The string to be split.
 * @returns {string[]} An array of trimmed strings.
 */
export function splitCommaSeparatedString(s: string): string[] {
  return s ? s.split(',').map((str) => str.trim()) : [];
}

/**
 * Gets the legacy ID from a Sanity ID.
 * collection_object_1234 -> 1234
 * exhibition_1234 -> 1234
 */
export function getLegacyId(id: string): string {
  return id.split('_').pop() || '';
}

/**
 * Converts Portable Text to plain text. If conversion fails, returns undefined.
 * TODO: This function doesn't seem to work with page content
 *
 * @param {any} portableTextBlocks - The Portable Text to convert.
 * @returns {string | undefined} The plain text or undefined if conversion fails.
 */
export function portableTextToPlaintext(portableTextBlocks: any): string | undefined {
  return toPlainText(portableTextBlocks)?.trim();
}

/**
 * Gets the value of a boolean from a string or boolean, or return false.
 *
 * @param x the value to check
 * @returns  true if x is a boolean or a string that is 'true', false otherwise
 */
export function getBooleanValue(x?: boolean | string | string[] | number | null) {
  if (typeof x === 'boolean') return x;
  if (typeof x === 'string') {
    return x.toLowerCase() === 'true' || x === '1';
  }
  if (typeof x === 'number') return x === 1;
  return false; // undefined, null, string[]
}
