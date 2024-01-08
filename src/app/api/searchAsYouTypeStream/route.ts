import type { ApiSearchResponse, ElasticsearchDocument } from '@/types';
import { searchAsYouType } from '@/lib/elasticsearch/api/searchAsYouType';

export const config = {
  runtime: 'experimental-edge',
};

function iteratorToStream(iterator: AsyncGenerator<string, void, unknown>): ReadableStream {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

async function* searchResultsGenerator(
  query: string | null,
): AsyncGenerator<string, void, unknown> {
  if (!query) return;
  const results: ApiSearchResponse = await searchAsYouType(query);
  let isFirstResult = true;
  yield '['; // Start of JSON array
  for (const result of results.data) {
    if (!isFirstResult) yield ',';
    yield JSON.stringify(result as ElasticsearchDocument);
    isFirstResult = false;
  }
  yield ']'; // End of JSON array
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  const iterator: AsyncGenerator<string, void, unknown> = searchResultsGenerator(query);
  const stream: ReadableStream = iteratorToStream(iterator);

  return new Response(stream, {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}
