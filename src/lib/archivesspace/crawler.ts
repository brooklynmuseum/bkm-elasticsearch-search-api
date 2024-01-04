import { getEnvVar } from '../utils';

const SEARCH_URL = 'https://brooklynmuseum-api.libraryhost.com/search';
const SEARCH_PAGE_SIZE = 100;

/**
 * Authenticates with ArchivesSpace and returns a session token
 * @returns {Promise<string>} The session token
 */
async function authenticate(): Promise<string> {
  const username = getEnvVar('ARCHIVESSPACE_USERNAME');
  const password = getEnvVar('ARCHIVESSPACE_PASSWORD');
  const authUrl = `https://brooklynmuseum-api.libraryhost.com/users/${username}/login`;

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `password=${password}`,
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status}`);
  }
  console.log('Authenticated with ArchivesSpace');

  const data = await response.json();
  return data.session;
}

/**
 * Fetches data from ArchivesSpace
 * @param session The session token
 */
async function* fetchArchivesSpaceData(session: string): AsyncGenerator<any[], void, undefined> {
  let page = 1;
  let keepFetching = true;

  while (keepFetching) {
    const url = `${SEARCH_URL}?page=${page}&page_size=${SEARCH_PAGE_SIZE}`;
    const response = await fetch(url, {
      headers: { 'X-ArchivesSpace-Session': session },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      yield data.results;
      page++;
    } else {
      keepFetching = false;
    }
  }
}

/**
 * Crawls ArchivesSpace
 * @returns {AsyncGenerator<any[], void, undefined>} The data batches
 */
export async function* crawlArchivesSpace(): AsyncGenerator<any[], void, undefined> {
  try {
    const sessionToken = await authenticate();
    for await (const docsBatch of fetchArchivesSpaceData(sessionToken)) {
      yield docsBatch;
    }
  } catch (error) {
    console.error('Error in ArchivesSpace crawling:', error);
  }
}
