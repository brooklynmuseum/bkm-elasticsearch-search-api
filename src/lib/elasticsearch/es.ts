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
    await deleteIndex(indexName);
  }
  const indexExists = await existsIndex(indexName);
  if (!indexExists) {
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
