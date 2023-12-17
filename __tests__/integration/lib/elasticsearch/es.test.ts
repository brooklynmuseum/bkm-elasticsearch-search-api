import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { createIndex, bulkUpsert, existsIndex, deleteIndex } from '@/lib/elasticsearch/es';
import { client } from '@/lib/elasticsearch/client';
import type { JsonData } from '@/types';

const testIndexName = 'test_index';
const testDocuments: JsonData[] = [
  { _id: '1', field1: 'value1', field2: 'value2' },
  { _id: '2', field1: 'value3', field2: 'value4' },
];

const indexSettings = {
  settings: {
    index: {
      number_of_shards: 1,
      number_of_replicas: 0,
    },
  },
  mappings: {
    properties: {
      field1: { type: 'keyword' },
      field2: { type: 'text' },
    },
  },
};

describe('Elasticsearch Utility Functions', () => {
  beforeAll(async () => {
    if (await existsIndex(testIndexName)) {
      await deleteIndex(testIndexName);
    }
  });

  it('should create an index', async () => {
    await createIndex(testIndexName, indexSettings);
    const indexExists = await existsIndex(testIndexName);
    expect(indexExists).toBeTruthy();
  });

  it('should bulk upsert documents into the index', async () => {
    await bulkUpsert(testIndexName, testDocuments);
    const response = await client.get({ index: testIndexName, id: testDocuments[0]._id });
    expect(response._id).toEqual(testDocuments[0]._id);
    expect(response._source).toEqual({ field1: 'value1', field2: 'value2' });
  });

  it('should delete an index', async () => {
    await deleteIndex(testIndexName);
    const indexExists = await existsIndex(testIndexName);
    expect(indexExists).toBeFalsy();
  });

  afterAll(async () => {
    if (await existsIndex(testIndexName)) {
      await deleteIndex(testIndexName);
    }
  });
});
