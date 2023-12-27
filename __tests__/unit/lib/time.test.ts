import { convertDateToUTC } from '@/lib/time';

describe('convertDateToUTC', () => {
  it('should correctly convert a valid date string to UTC', () => {
    const date = '2023-01-01';
    const result = convertDateToUTC(date);
    expect(result).toBeDefined();
    expect(result?.toISOString()).toEqual('2023-01-01T05:00:00.000Z');
  });

  it('should return undefined for an invalid date string', () => {
    const invalidDate = '2023-02-33';
    const result = convertDateToUTC(invalidDate);
    expect(result).toBeUndefined();
  });

  it('should return undefined for an empty date string', () => {
    const emptyDate = '';
    const result = convertDateToUTC(emptyDate);
    expect(result).toBeUndefined();
  });
});
