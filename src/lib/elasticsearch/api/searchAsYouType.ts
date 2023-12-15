import * as T from '@elastic/elasticsearch/lib/api/types';

import type { ApiSearchResponse, ElasticsearchDocument } from '@/types';
import { client } from '../client';
import { getEnvVar } from '@/lib/various';

const INDEX_NAME = getEnvVar('ELASTIC_INDEX_NAME');
const MAX_SUGGESTIONS = 10; // Maximum number of suggestions to return

/**
 * Use Elasticsearch search-as-you-type to search terms:
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html
 *
 * @param params contains 'q' string representing query
 * @returns ApiSearchResponse object containing query and data
 */
export async function searchAsYouType(q?: string | null): Promise<ApiSearchResponse> {
  if (!q) return {};

  const esQuery: T.SearchRequest = {
    index: INDEX_NAME,
    query: {
      multi_match: {
        query: q,
        type: 'bool_prefix',
        fields: ['title.suggest', 'title.suggest._2gram', 'title.suggest._3gram'],
      },
    },
    _source: ['title'], // Just return the title
    size: MAX_SUGGESTIONS,
  };

  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const data = response.hits.hits.map((h) => h._source as ElasticsearchDocument);
  const res: ApiSearchResponse = { query: esQuery, data };
  return res;
}
