import * as T from '@elastic/elasticsearch/lib/api/types';
import { aggFields } from '../config/indexSettings';
import { format, formatISO } from 'date-fns';

const SEARCH_AGG_SIZE = 100;

/**
 * Add a term to a bool filter query
 *
 * @param esQuery   The ES query
 * @param name    The name of the field to filter on
 * @param value   The value to filter on
 * @returns  Void.  The ES Query is modified in place
 */
export function addQueryBoolFilterTerm(
  esQuery: any,
  name: string,
  value: string | boolean | number | undefined,
): void {
  if (!value) return;
  esQuery.query ??= {};
  esQuery.query.bool ??= {};
  esQuery.query.bool.filter ??= [];
  esQuery.query.bool.filter.push({
    term: {
      [name]: value,
    },
  });
}

export function addQueryAggs(esQuery: any) {
  const aggs: any = {};
  for (const aggName of aggFields) {
    aggs[aggName] = {
      terms: {
        field: aggName,
        size: SEARCH_AGG_SIZE,
      },
    };
  }
  esQuery.aggs = aggs;
}

/**
 * For the default date range query, we only want documents (events) that
 * have already started OR have no start date.
 * @param esQuery
 * @param searchParams
 */
export function addDefaultQueryBoolDateRange(esQuery: any) {
  const boolQuery: T.QueryDslQueryContainer = {
    bool: {
      should: [
        {
          range: {
            startDate: {
              lte: format(new Date(), 'yyyy-MM-dd'),
            },
          },
        },
        {
          bool: {
            must_not: {
              exists: {
                field: 'startDate',
              },
            },
          },
        },
      ],
      minimum_should_match: 1,
    },
  };
  esQuery.query ??= {};
  esQuery.query.bool ??= {};
  esQuery.query.bool.filter ??= [];
  esQuery.query.bool.filter.push(boolQuery);
}

export function addQueryBoolDateRange(
  esQuery: any,
  startDate: Date | undefined,
  endDate: Date | undefined,
) {
  if (!startDate && !endDate) return;
  console.log('startdate', startDate, endDate);
  const ranges: T.QueryDslQueryContainer[] = [];
  if (startDate) {
    ranges.push({
      range: {
        startDate: {
          lte: formatISO(startDate, { representation: 'date' }),
        },
      },
    });
  }
  if (endDate) {
    ranges.push({
      range: {
        endDate: {
          gte: formatISO(endDate, { representation: 'date' }),
        },
      },
    });
  }
  if (ranges.length > 0) {
    esQuery.query ??= {};
    esQuery.query.bool ??= {};
    esQuery.query.bool.filter ??= [];
    esQuery.query.bool.filter.push(...ranges);
  }
}

/**
 * Currently only supports year ranges
 *
 * @param esQuery The ES query to modify in place
 * @param searchParams The search params
 */
export function addQueryBoolYearRange(
  esQuery: any,
  startYear: number | undefined,
  endYear: number | undefined,
) {
  const ranges: T.QueryDslQueryContainer[] = [];
  if (startYear !== undefined && endYear !== undefined && startYear <= endYear) {
    ranges.push({
      range: {
        startYear: {
          gte: startYear,
          lte: endYear,
        },
      },
    });
    ranges.push({
      range: {
        endYear: {
          gte: startYear,
          lte: endYear,
        },
      },
    });
  } else if (startYear !== undefined) {
    ranges.push({
      range: {
        startYear: {
          gte: startYear,
        },
      },
    });
  } else if (endYear !== undefined) {
    ranges.push({
      range: {
        endYear: {
          lte: endYear,
        },
      },
    });
  }
  if (ranges.length > 0) {
    esQuery.query ??= {};
    esQuery.query.bool ??= {};
    esQuery.query.bool.filter ??= [];
    esQuery.query.bool.filter.push(...ranges);
  }
}

/*


export function addQueryBoolFilterTerms(esQuery: any, searchParams: ApiSearchParams) {
  if (indicesMeta[searchParams.index]?.filters?.length > 0) {
    for (const filter of indicesMeta[searchParams.index].filters) {
      switch (filter) {
        case 'onView':
          if (searchParams.onView) {
            addQueryBoolFilterTerm(esQuery, 'onView', true);
          }
          break;
        case 'hasPhoto':
          if (searchParams.hasPhoto) {
            addQueryBoolFilterExists(esQuery, 'image.url');
          }
          break;
        case 'isUnrestricted':
          if (searchParams.isUnrestricted) {
            addQueryBoolFilterTerm(esQuery, 'copyrightRestricted', true);
          }
          break;
        default:
          if (searchParams?.aggFilters[filter]) {
            addQueryBoolFilterTerm(esQuery, filter, searchParams?.aggFilters[filter]);
          }
      }
    }
  }
}



export function addQueryBoolFilter(esQuery: any, filter: any): void {
  if (!filter) return;
  esQuery.query ??= {};
  esQuery.query.bool ??= {};
  esQuery.query.bool.filter ??= [];
  esQuery.query.bool.filter.push(filter);
}

/**
 * Add an exists clause to a bool filter query
 *
 * @param esQuery   The ES query
 * @param name    The name of the field to filter on
 * @returns  Void.  The ES Query is modified in place
 */ /*
export function addQueryBoolFilterExists(esQuery: any, name: string): void {
  esQuery.query ??= {};
  esQuery.query.bool ??= {};
  esQuery.query.bool.filter ??= [];
  esQuery.query.bool.filter.push({
    exists: {
      field: name,
    },
  });
}

/**
 * Add a term to a bool must not section of query
 *
 * @param esQuery The ES query
 * @param name  The name of the field that must exist
 * @returns  Void.  The ES Query is modified in place
 */ /*
export function addQueryBoolMustNotFilter(
  esQuery: any,
  name: string,
  value: string | boolean | number | undefined,
): void {
  if (!value) return;
  esQuery.query ??= {};
  esQuery.query.bool ??= {};
  esQuery.query.bool.must_not ??= [];
  esQuery.query.bool.must_not.push({
    term: {
      [name]: value,
    },
  });
}


*/
