import type { JsonData } from '@/types';
// import { toHTML } from '@portabletext/to-html';
// import sanitizeHtml from 'sanitize-html';
import { toPlainText } from '@portabletext/toolkit';

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
