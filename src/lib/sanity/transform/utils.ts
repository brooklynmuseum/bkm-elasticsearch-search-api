import type { JsonData, ElasticsearchDocument } from '@/types';
import { toPlainText } from '@portabletext/toolkit';
import { convertDateToUTC } from '@/lib/time';
import { removeHtml } from '@/lib/utils';

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
  const dateInUTC = convertDateToUTC(value);
  if (dateInUTC) {
    obj[`${type}Date`] = dateInUTC.toISOString();
    obj[`${type}Year`] = dateInUTC.getFullYear();
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
  if (!id) {
    throw new Error('ID is undefined: ' + id);
  }
  return id.split('_').pop() || '';
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

/**
 * Replace non-breaking spaces, tabs, and other non-standard spaces.
 * @param str The string to replace
 * @returns The string with non-standard spaces replaced with standard spaces
 */
export function replaceNonStandardSpaces(str: string): string {
  if (!str) return '';
  return str.replace(/[\s\u00A0]+/g, ' ').trim();
}

/**
 * Replace all newlines with spaces.
 * @param str The string to replace
 * @returns The string with newlines replaced with spaces
 */
export function replaceAllNewlinesWithSpaces(str: string): string {
  if (!str) return '';
  return str.replace(/(\r\n|\n|\r)/g, ' ').trim();
}

/**
 * Remove HTML, replace non-standard spaces, and replace newlines with spaces.
 * @param str The string to replace
 * @returns The string with HTML removed, non-standard spaces replaced, and newlines replaced with spaces
 */
export function getPlainSearchText(str: string): string {
  return replaceAllNewlinesWithSpaces(replaceNonStandardSpaces(removeHtml(str)));
}

/**
 * Converts Portable Text to plain text. If conversion fails, returns undefined.
 *
 * @param {any} portableTextBlocks - The Portable Text to convert.
 * @returns {string | undefined} The plain text or undefined if conversion fails.
 */
export function portableTextToPlaintext(portableTextBlocks: any): string | undefined {
  return replaceNonStandardSpaces(toPlainText(portableTextBlocks));
}

/**
 * Recursively converts structured content to plain text.
 * Convert all block text to strings, and join them with string values.
 *
 * @param content Arbitrary structured content to convert
 * @returns The plain text
 */
export function recursivePortableTextToPlaintext(content: any): string {
  if (Array.isArray(content)) {
    return content
      .map((item) => recursivePortableTextToPlaintext(item))
      .join(' ')
      .trim();
  } else if (content && typeof content === 'object') {
    if (content?._type === 'block') {
      return portableTextToPlaintext(content) || '';
    } else {
      return Object.values(content)
        .map((value) => recursivePortableTextToPlaintext(value))
        .join(' ')
        .trim();
    }
  }
  return '';
}
