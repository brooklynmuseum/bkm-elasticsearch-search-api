import * as dotenv from 'dotenv';
dotenv.config();
import { search } from './lib/elasticsearch/search';

async function main() {
  const res = await search({
    pageNumber: 1,
    resultsPerPage: 10,
    query: 'Yamashita',
  });
  console.log(JSON.stringify(res));
}

main();
