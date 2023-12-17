import * as T from '@elastic/elasticsearch/lib/api/types';
import { getEnvVar } from '@/lib/utils';
import { client } from '../client';
import type {
  ApiSearchResponse,
  ApiSearchResponseMetadata,
  ApiSearchParams,
  AggOptions,
} from '@/types';
import { addQueryBoolFilterTerm, addQueryAggs } from './searchQueryBuilder';
import { aggFields } from '../config/indexSettings';

const INDEX_NAME = getEnvVar('ELASTIC_INDEX_NAME');
const SANITY_TYPES = getEnvVar('SANITY_TYPES');

/**
 * Search for documents in one or more indices
 *
 * @param searchParams Search parameters
 * @returns Elasticsearch search response
 */
export async function search(searchParams: ApiSearchParams): Promise<ApiSearchResponse> {
  const esQuery: T.SearchRequest = {
    index: INDEX_NAME,
    query: { bool: { must: {} } },
    from: (searchParams.pageNumber - 1) * searchParams.resultsPerPage || 0,
    size: searchParams.resultsPerPage,
    track_total_hits: true,
  };
  if (searchParams.query && esQuery?.query?.bool) {
    esQuery.query.bool.must = [
      {
        multi_match: {
          query: searchParams.query,
          type: 'cross_fields',
          operator: 'and',
          fields: [
            'boostedKeywords^20',
            'primaryConstituent.name.search^4',
            'title.search^2',
            'tags^2',
            'description',
            'searchText',
          ],
        },
      },
    ];
  } else if (esQuery?.query?.bool) {
    esQuery.query.bool.must = [
      {
        match_all: {},
      },
    ];
  }

  for (const aggField of aggFields) {
    if (searchParams[aggField]) {
      addQueryBoolFilterTerm(esQuery, aggField, searchParams[aggField]);
    }
  }

  addQueryAggs(esQuery);

  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const metadata = getResponseMetadata(response, searchParams.resultsPerPage);
  const options = getResponseAggOptions(response);
  const data = response.hits.hits.map((hit) => hit._source);
  const res: ApiSearchResponse = { query: esQuery, data, options, metadata };
  return res;
}

/**
 * Get the total number of results and the number of pages
 *
 * @param response The response from the ES search
 * @param size The number of results per page
 * @returns Object with the total number of results and the number of pages
 */
function getResponseMetadata(
  response: T.SearchTemplateResponse,
  size: number,
): ApiSearchResponseMetadata {
  let total = response?.hits?.total || 0; // Returns either number or SearchTotalHits
  if (typeof total !== 'number') total = total.value;
  return {
    total,
    pages: Math.ceil(total / size),
  };
}

/**
 * Get the options/buckets for each agg in the response
 *
 * @param response The response from the ES search
 * @returns Array of aggregations with options/buckets
 */
function getResponseAggOptions(response: T.SearchTemplateResponse): AggOptions {
  const options: AggOptions = {};
  if (response?.aggregations) {
    Object.keys(response?.aggregations).forEach((field) => {
      if (response.aggregations?.[field] !== undefined) {
        const aggAgg: T.AggregationsAggregate = response.aggregations?.[field];
        if ('buckets' in aggAgg && aggAgg?.buckets) options[field] = aggAgg.buckets;
      }
    });
  }
  return options;
}
