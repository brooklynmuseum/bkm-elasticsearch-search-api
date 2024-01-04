import { setIfHasValue, removeHtml } from '@/lib/utils';
import type { JsonData } from '@/types';

describe('setIfHasValue', () => {
  it('should set the key with a non-empty value', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', 'testValue');
    expect(obj).toEqual({ testKey: 'testValue' });
  });

  it('should not set the key if value is undefined', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', undefined);
    expect(obj).toEqual({});
  });

  it('should not set the key if value is null', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', null);
    expect(obj).toEqual({});
  });

  it('should not set the key if value is an empty string', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', '');
    expect(obj).toEqual({});
  });

  it('should set the key with a numeric value', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', 123);
    expect(obj).toEqual({ testKey: 123 });
  });

  it('should set the key with a boolean value', () => {
    const obj: JsonData = {};
    setIfHasValue(obj, 'testKey', true);
    expect(obj).toEqual({ testKey: true });
  });
});

describe('removeHtml', () => {
  it('removes HTML tags from a string', () => {
    const input = '<p>This is <strong>important</strong> text.</p>';
    const expected = 'This is important text.';
    expect(removeHtml(input)).toBe(expected);
  });

  it('returns the original string when it contains no HTML tags', () => {
    const input = 'Just a plain text string';
    expect(removeHtml(input)).toBe(input);
  });

  it('returns an empty string when input is undefined', () => {
    expect(removeHtml(undefined)).toBe('');
  });

  it('returns an empty string when input is an empty string', () => {
    expect(removeHtml('')).toBe('');
  });
});
