/**
 * Encapsulates & validates search parameters.
 */
export const DEFAULT_SEARCH_PAGE_SIZE = 24;
export const MAX_SEARCH_PAGE_SIZE = 100;
export const MAX_PAGES = 1000; // Don't allow more than 1000 pages of results

import type { ApiSearchParams } from '@/types';

import { aggFields } from '../config/indexSettings';

// Type: See: https://github.com/vercel/next.js/discussions/46131
export type GenericSearchParams = {
  [key: string]: string | string[] | undefined;
};

/**
 * Validate and transform raw search parameters.
 *
 * @param params - Raw query string parameters.
 * @returns Validated and transformed search parameters.
 */
export function getSanitizedSearchParams(params: GenericSearchParams): ApiSearchParams {
  const sanitizedParams: Partial<ApiSearchParams> = {};

  // page number between 1 and MAX_PAGES
  const pageNumber = typeof params.page === 'string' ? parseInt(params.page, 10) : undefined;
  sanitizedParams.pageNumber =
    pageNumber && pageNumber > 0 && pageNumber <= MAX_PAGES ? pageNumber : 1;

  // size (number of results shown per page)
  const size = typeof params.size === 'string' ? parseInt(params.size, 10) : undefined;
  sanitizedParams.resultsPerPage =
    size && size > 0 && size < MAX_SEARCH_PAGE_SIZE ? size : DEFAULT_SEARCH_PAGE_SIZE;

  // search query
  sanitizedParams.query = typeof params.query === 'string' && params.query ? params.query : '';

  for (const aggField of aggFields) {
    if (params[aggField]) {
      sanitizedParams[aggField] = params[aggField] as string;
    }
  }

  return sanitizedParams as ApiSearchParams;
}
