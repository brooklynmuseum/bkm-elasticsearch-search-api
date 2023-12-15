import type { JsonData } from '@/types';
import { toHTML } from '@portabletext/to-html';
import sanitizeHtml from 'sanitize-html';

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

export function portableTextToPlaintext(portableTextBlocks: JsonData): string | undefined {
  if (!portableTextBlocks) return;
  const dirtyHtml = toHTML(portableTextBlocks, {});
  if (!dirtyHtml) return;
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [],
  });
}
