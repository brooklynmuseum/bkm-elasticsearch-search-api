import { aggFields } from '../config/indexSettings';
import type { ApiSearchParams, SortOrder } from '@/types';
import { convertDateToUTC } from '@/lib/time';

/**
 * Encapsulates & validates search parameters.
 */
export const DEFAULT_SEARCH_PAGE_SIZE = 24;
export const MAX_SEARCH_PAGE_SIZE = 100;
export const MAX_PAGES = 1000; // Don't allow more than 1000 pages of results
export const SORT_ORDER_ASC: SortOrder = 'asc';
export const SORT_ORDER_DESC: SortOrder = 'desc';
export const SORT_ORDER_DEFAULT = SORT_ORDER_ASC;
export const SORT_ORDERS = [SORT_ORDER_ASC, SORT_ORDER_DESC];

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
  sanitizedParams.size =
    size && size > 0 && size < MAX_SEARCH_PAGE_SIZE ? size : DEFAULT_SEARCH_PAGE_SIZE;

  // sort field & order
  sanitizedParams.sortField = typeof params.sortField === 'string' ? params.sortField : '';
  sanitizedParams.sortOrder = SORT_ORDERS.includes(params.sortOrder as SortOrder)
    ? (params.sortOrder as SortOrder)
    : SORT_ORDER_DEFAULT;

  // search query
  sanitizedParams.query = typeof params.query === 'string' && params.query ? params.query : '';

  // search filters
  for (const aggField of aggFields) {
    if (typeof params[aggField] === 'string' && params[aggField]) {
      sanitizedParams[aggField] = params[aggField] as string;
    }
  }
  if (params.visible === 'true') {
    sanitizedParams.visible = true;
  }
  if (params.publicAccess === 'true') {
    sanitizedParams.publicAccess = true;
  }
  if (params.rawSource === 'true') {
    sanitizedParams.rawSource = true;
  }

  // date/year ranges
  if (typeof params.startDate === 'string' && params.startDate) {
    const utcStartDate = convertDateToUTC(params.startDate);
    if (utcStartDate) {
      sanitizedParams.startDate = convertDateToUTC(params.startDate);
    }
  }
  if (typeof params.endDate === 'string' && params.endDate) {
    const utcEndDate = convertDateToUTC(params.endDate);
    if (utcEndDate) {
      sanitizedParams.endDate = convertDateToUTC(params.endDate);
    }
  }
  if (typeof params.startYear === 'string') {
    sanitizedParams.startYear = parseInt(params.startYear);
  }
  if (typeof params.endYear === 'string') {
    sanitizedParams.endYear = parseInt(params.endYear);
  }

  return sanitizedParams as ApiSearchParams;
}
