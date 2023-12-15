import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { search } from '@/lib/elasticsearch/search';

describe('search function', () => {
  it('searches "Yamashita" and returns the expected result', async () => {
    const result = await search({
      pageNumber: 1,
      resultsPerPage: 10,
      query: 'Yamashita',
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0]._id).toEqual('collection_artist_21585');
  });

  it('searches "Spike Lee" and returns the expected result', async () => {
    const result = await search({
      pageNumber: 1,
      resultsPerPage: 10,
      query: 'Spike Lee',
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0]._id).toEqual('232b72a6-3b97-41fe-bfc4-33c5649dda83');
  });
});
