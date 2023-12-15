import * as T from '@elastic/elasticsearch/lib/api/types';
import { getEnvVar } from '@/lib/various';
import { client } from '../client';
import type {
  ApiSearchResponse,
  ApiSearchResponseMetadata,
  ApiSearchParams,
  ElasticsearchDocument,
} from '@/types';
import { addQueryBoolFilterTerm } from './searchQueryBuilder';

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
            'keywords^2',
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

  if (searchParams.type && SANITY_TYPES.includes(searchParams.type)) {
    addQueryBoolFilterTerm(esQuery, 'type', searchParams.type);
  }

  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const options = {};
  const metadata = getResponseMetadata(response, searchParams.resultsPerPage);
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
  let count = response?.hits?.total || 0; // Returns either number or SearchTotalHits
  if (typeof count !== 'number') count = count.value;
  return {
    count,
    pages: Math.ceil(count / size),
  };
}
