import type { JsonData } from '@/types';
// import { toHTML } from '@portabletext/to-html';
// import sanitizeHtml from 'sanitize-html';
import { toPlainText } from '@portabletext/toolkit';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export function setIfHasValue(obj: JsonData, key: string, value: any) {
  if (value !== undefined && value !== null) {
    obj[key] = value;
  }
}

export function splitCommaSeparatedString(s: string): string[] {
  if (!s) return [];
  return s.split(',').map((s) => s.trim());
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
 * TODO: This function doesn't seem to work with page content
 * @param portableTextBlocks
 * @returns
 */
export function portableTextToPlaintext(portableTextBlocks: any): string | undefined {
  return toPlainText(portableTextBlocks)?.trim();
}

/*
export function portableTextToHtml(portableTextBlocks: JsonData): string | undefined {
  if (!portableTextBlocks) return;
  return toHTML(portableTextBlocks, {
    components: {
      types: {
        textSection: ({ value }) => {
          console.log('uuu', JSON.stringify(value));
          return `<p>${value.content?.children}</p>`;
        },
        threeUpTextSection: ({ value }) => {
          return `<p>${value.content?.children}</p>`;
        },
      },
    },
  });
}

export function portableTextToPlaintext(portableTextBlocks: JsonData): string | undefined {
  const dirtyHtml = portableTextToHtml(portableTextBlocks);
  if (!dirtyHtml) return;
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [],
  });
}
*/
