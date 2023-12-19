import {
  getSanitizedSearchParams,
  DEFAULT_SEARCH_PAGE_SIZE,
  MAX_PAGES,
  SORT_ORDER_ASC,
  SORT_ORDER_DESC,
} from '@/lib/elasticsearch/api/searchParams'; // Update with the correct path
import { aggFields } from '@/lib/elasticsearch/config/indexSettings';

describe('getSanitizedSearchParams', () => {
  it('should return default values for empty input', () => {
    const params = {};
    const result = getSanitizedSearchParams(params);
    expect(result.pageNumber).toBe(1);
    expect(result.size).toBe(DEFAULT_SEARCH_PAGE_SIZE);
    expect(result.sortOrder).toBe(SORT_ORDER_ASC);
    expect(result.query).toBe('');
  });

  it('should handle valid page and size parameters', () => {
    const params = { page: '2', size: '50' };
    const result = getSanitizedSearchParams(params);
    expect(result.pageNumber).toBe(2);
    expect(result.size).toBe(50);
  });

  it('should restrict page and size to their max values', () => {
    const params = { page: `${MAX_PAGES + 1}`, size: '150' };
    const result = getSanitizedSearchParams(params);
    expect(result.pageNumber).toBe(1);
    expect(result.size).toBe(DEFAULT_SEARCH_PAGE_SIZE);
  });

  it('should handle valid sort order and field', () => {
    const params = { sortField: 'name', sortOrder: SORT_ORDER_DESC };
    const result = getSanitizedSearchParams(params);
    expect(result.sortField).toBe('name');
    expect(result.sortOrder).toBe(SORT_ORDER_DESC);
  });

  it('should use default sort order for invalid input', () => {
    const params = { sortOrder: 'random' };
    const result = getSanitizedSearchParams(params);
    expect(result.sortOrder).toBe(SORT_ORDER_ASC);
  });

  it('should handle valid search query', () => {
    const params = { query: 'hiroshige' };
    const result = getSanitizedSearchParams(params);
    expect(result.query).toBe('hiroshige');
  });

  aggFields.forEach((field) => {
    it(`should handle valid aggField: ${field}`, () => {
      const params = { [field]: 'testValue' };
      const result = getSanitizedSearchParams(params);
      expect(result[field]).toBe('testValue');
    });
  });
});
