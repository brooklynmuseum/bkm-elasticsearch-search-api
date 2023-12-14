import { indexSettings } from "./config/indexSettings";
import { client } from "./client";

/**
 * Create an Elasticsearch index.
 *
 * @param indexName Name of the index.
 * @param deleteIndexIfExists Delete the index if it already exists.
 * @param deleteAliasIfExists Delete the alias if it already exists.
 */
export async function createIndex(
  indexName: string,
) {
  await deleteIndex(indexName);
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
async function existsIndex(
  indexName: string
): Promise<boolean> {
  return (await client.indices.exists({ index: indexName })) ? true : false;
}

async function deleteIndex(indexName: string) {
  if (await existsIndex(indexName)) {
    try {
      await client.indices.delete({ index: indexName });
    } catch (err) {
      console.error(`Error deleting index ${indexName}: ${err}`);
    }
  }
}
