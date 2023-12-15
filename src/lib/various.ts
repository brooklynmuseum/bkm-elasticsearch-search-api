import type { JsonData } from '@/types';

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
