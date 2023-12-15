/**
 * Encapsulates & validates search parameters.
 */
export const DEFAULT_SEARCH_PAGE_SIZE = 24;
export const MAX_SEARCH_PAGE_SIZE = 100;
export const MAX_PAGES = 1000; // Don't allow more than 1000 pages of results

export interface SearchParams {
  pageNumber: number; // page number
  resultsPerPage: number; // number of results per page
  query?: string; // search query
  type?: string; // content type to filter by
}

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
export function getSanitizedSearchParams(params: GenericSearchParams): SearchParams {
  const sanitizedParams: Partial<SearchParams> = {};

  // page number between 1 and MAX_PAGES
  const pageNumber = typeof params.p === 'string' ? parseInt(params.p, 10) : undefined;
  sanitizedParams.pageNumber =
    pageNumber && pageNumber > 0 && pageNumber <= MAX_PAGES ? pageNumber : 1;

  // size (number of results shown per page)
  const size = typeof params.size === 'string' ? parseInt(params.size, 10) : undefined;
  sanitizedParams.resultsPerPage =
    size && size > 0 && size < MAX_SEARCH_PAGE_SIZE ? size : DEFAULT_SEARCH_PAGE_SIZE;

  // q (search query)
  sanitizedParams.query = typeof params.q === 'string' && params.q ? params.q : '';

  return sanitizedParams as SearchParams;
}
