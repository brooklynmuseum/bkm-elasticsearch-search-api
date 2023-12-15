import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { search } from '@/lib/elasticsearch/search';

describe('search function', () => {
  it('sends the correct request and returns the expected result', async () => {
    const result = await search({
      pageNumber: 1,
      resultsPerPage: 10,
      query: 'Yamashita',
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0]._id).toEqual('collection_artist_21585');
  });
});
