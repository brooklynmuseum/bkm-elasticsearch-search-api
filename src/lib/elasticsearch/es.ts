import { client } from './client';
import type { JsonData } from '@/types';
import * as T from '@elastic/elasticsearch/lib/api/types';

/**
 * Create an Elasticsearch index.
 *
 * @param indexName Name of the index.
 * @param deleteIndexIfExists Delete the index if it already exists.
 * @param deleteAliasIfExists Delete the alias if it already exists.
 */
export async function createIndex(
  indexName: string,
  indexSettings: T.IndicesIndexSettings,
  deleteIndexIfExists = false,
) {
  if (deleteIndexIfExists) {
    console.log(`Deleting index ${indexName}...`);
    await deleteIndex(indexName);
  }
  const indexExists = await existsIndex(indexName);
  if (!indexExists) {
    console.log(`Creating index ${indexName}...`);
    await client.indices.create({
      index: indexName,
      body: indexSettings,
    });
  }
}

/**
 * Check if a given index already exists in Elasticsearch.
 *
 * @param indexName Name of the index.
 * @returns True if the index exists, false otherwise.
 */
export async function existsIndex(indexName: string): Promise<boolean> {
  return (await client.indices.exists({ index: indexName })) ? true : false;
}

/**
 * Delete an Elasticsearch index.
 *
 * @param indexName Name of the index.
 */
export async function deleteIndex(indexName: string) {
  if (await existsIndex(indexName)) {
    try {
      await client.indices.delete({ index: indexName });
    } catch (err) {
      console.error(`Error deleting index ${indexName}: ${err}`);
    }
  }
}

/**
 * Bulk upsert documents to an Elasticsearch index.
 *
 * @param indexName Name of the index.
 * @param documents Documents to be indexed.  Each document must define an `_id` property.
 */
export async function bulkUpsert(indexName: string, documents: JsonData[]): Promise<void> {
  if (!indexName || !documents || documents.length === 0) return;

  const body = documents.flatMap((doc) => {
    const docClone = { ...doc };
    delete docClone._id; // Delete the _id property
    return [
      { update: { _index: indexName, _id: doc._id } },
      { doc: docClone, doc_as_upsert: true },
    ];
  });

  try {
    const bulkResponse = await client.bulk({ refresh: true, body });

    if (bulkResponse.errors) {
      const erroredDocuments: any[] = [];
      bulkResponse.items.forEach((action: any, i: number) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            ...documents[i],
            error: action[operation].error,
          });
        }
      });
      console.log('Some documents failed to upload:', erroredDocuments);
    } else {
      console.log(`Successfully uploaded ${documents.length} documents`);
    }
  } catch (err) {
    console.error('Failed to upload documents:', err);
  }
}

/**
 * Searches all documents in a given Elasticsearch index that match the specified query.
 * Used for ingest and updating.
 *
 * @param {string} index - index to search within.
 * @param {T.QueryDslQueryContainer} [query] - Elasticsearch query to apply. If none is provided, default to matching all documents.
 * @param {any} [sourceFilter] - Optional, select which fields from the documents should be returned.
 * @returns {Promise<any[]>} - A promise that resolves to an array of the matching documents.
 */
export async function searchAll(
  index: string,
  query?: T.QueryDslQueryContainer,
  includeSource = true,
  sourceFilter?: any,
): Promise<any[]> {
  const results: any[] = [];
  const responseQueue: any[] = [];
  const esQuery: T.SearchRequest = {
    index,
    scroll: '30s',
    size: 10000,
  };
  if (query) {
    esQuery.query = query;
  } else {
    esQuery.query = {
      match_all: {},
    };
  }

  if (!includeSource) {
    // Exclude all source fields
    esQuery._source = false;
  } else if (sourceFilter) {
    // Include only specified source fields
    esQuery._source = sourceFilter;
  }

  const response = await client.search(esQuery);
  responseQueue.push(response);

  while (responseQueue.length) {
    const body = responseQueue.shift();
    results.push(...body.hits.hits);
    if (body.hits.total.value === results.length) {
      break;
    }
    responseQueue.push(
      await client.scroll({
        scroll_id: body._scroll_id,
        scroll: '30s',
      }),
    );
  }
  return results;
}

/**
 * Get IDs for all documents in a given Elasticsearch index that match the specified query.
 *
 * @param indexName Name of the index.
 * @param query Elasticsearch query to apply. If none is provided, default to matching all documents.
 * @returns A promise that resolves to an array of the matching document IDs.
 */
export async function searchAllIds(indexName: string, query?: T.QueryDslQueryContainer) {
  const results = await searchAll(indexName, query, false);
  return results.map((result) => result._id);
}

/**
 * Delete all documents in an Elasticsearch index with the specified IDs.
 *
 * @param indexName Name of the index.
 * @param idsToDelete IDs of the documents to delete.
 */
export async function deleteIds(indexName: string, idsToDelete: string[]) {
  if (!indexName || !idsToDelete || idsToDelete.length === 0) return;

  console.log(`Deleting ${idsToDelete.length} ids from index ${indexName}...`);

  const deleteChunkSize = 10000;
  for (let i = 0; i < idsToDelete.length; i += deleteChunkSize) {
    const chunk = idsToDelete.slice(i, i + deleteChunkSize);
    await client.deleteByQuery({
      index: indexName,
      body: {
        query: {
          ids: {
            values: chunk,
          },
        },
      },
    });
  }
}
