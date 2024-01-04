import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import sanitizeHtml from 'sanitize-html';
import type { JsonData } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      throw new Error(`Environment variable ${key} is missing`);
    }
  }
  return value;
}

export function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Removes all HTML tags from a string.
 * @param str The string to remove HTML from
 * @returns The string with HTML removed
 */
export function removeHtml(str: string | undefined): string {
  if (!str) return '';
  return sanitizeHtml(str, { allowedTags: [] });
}

/**
 * Assigns a value to a key in a JSON object if the value is neither undefined nor null.
 *
 * @param {JsonData} obj - The object to be updated.
 * @param {string} key - The key in the object to be set.
 * @param {any} value - The value to set for the key.
 */
export function setIfHasValue(obj: JsonData, key: string, value: any) {
  if (value !== undefined && value !== null && value !== '' && value !== isNaN) {
    obj[key] = value;
  }
}

export function mapLanguageToLocale(language: string | undefined): string | undefined {
  if (language === 'eng') return 'en-US';
  if (language === 'spa') return 'es-ES';
}
