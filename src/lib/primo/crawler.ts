/**
 * Syncs Primo collections
 *
 * 1. Get a list of all Collections from Primo endpoint, e.g.:
 *    https://library.brooklynmuseum.org/primaws/rest/priv/myaccount/collection?ilsgEntityParams=primo_user_institution,01NYA_INST;ils_user_institution,01NYA_INST&inst=01NYA_INST&lang=en&name=get_collections&useCache=true&userInst=01NYA_INST&vid=01NYA_INST:Brooklyn
 * 2. Using the collection.pid.value (e.g. 81113271810007141), get all documents
 *    in the collection from Primo endpoint, e.g.:
 *    https://library.brooklynmuseum.org/primaws/rest/pub/pnxs?acTriggered=false&disableCache=false&getMore=0&inst=01NYA_INST&isCDSearch=true&lang=en&limit=20&newspapersActive=false&newspapersSearch=false&offset=0&q=cdparentid,exact,81113271810007141&qExclude=&qInclude=&refEntryActive=false&rtaLinks=true&scope=browse_search&skipDelivery=Y&tab=Brooklyn&vid=01NYA_INST:Brooklyn
 */
import { sleep } from '../utils';

const COLLECTIONS_URL = 'https://library.brooklynmuseum.org/primaws/rest/priv/myaccount/collection';
const DOCUMENTS_URL = 'https://library.brooklynmuseum.org/primaws/rest/pub/pnxs';
const SLEEP_SECONDS = 1;

interface GetCollectionsParams {
  ilsgEntityParams: string;
  inst: string;
  lang: string;
  name: string;
  useCache: boolean;
  userInst: string;
  vid: string;
}

interface GetDocumentsParams {
  acTriggered: boolean;
  disableCache: boolean;
  getMore: number;
  inst: string;
  isCDSearch: boolean;
  lang: string;
  limit: number;
  newspapersActive: boolean;
  newspapersSearch: boolean;
  offset: number;
  q: string;
  qExclude: string;
  qInclude: string;
  refEntryActive: boolean;
  rtaLinks: boolean;
  scope: string;
  skipDelivery: string;
  tab: string;
  vid: string;
}

async function* fetchCollectionDocuments(
  collectionPid: string,
): AsyncGenerator<any[], void, undefined> {
  const searchParams: GetDocumentsParams = {
    acTriggered: false,
    disableCache: false,
    getMore: 0,
    inst: '01NYA_INST',
    isCDSearch: true,
    lang: 'en',
    limit: 20,
    newspapersActive: false,
    newspapersSearch: false,
    offset: 0,
    q: `cdparentid,exact,${collectionPid}`,
    qExclude: '',
    qInclude: '',
    refEntryActive: false,
    rtaLinks: true,
    scope: 'browse_search',
    skipDelivery: 'Y',
    tab: 'Brooklyn',
    vid: '01NYA_INST:Brooklyn',
  };

  let keepFetching = true;

  while (keepFetching) {
    const url = new URL(DOCUMENTS_URL);
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });
    const queryString = Object.entries(searchParams)
      .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      .join('&');
    const response = await fetch(`${DOCUMENTS_URL}?${queryString}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // Process the data as needed

    if (data?.docs?.length > 0) {
      yield data.docs; // Yield a batch of documents

      // Update the offset for the next page
      searchParams.offset += searchParams.limit;
      // keepFetching = searchParams.offset < 10; // Adjust logic as needed
      keepFetching = false; // TODO
      await sleep(SLEEP_SECONDS);
    } else {
      keepFetching = false;
    }

    // Update the offset for the next page
    searchParams.offset += searchParams.limit;

    // Check if we should continue fetching
    // keepFetching = /* logic to determine if there are more pages, based on the response data */;
    keepFetching = searchParams.offset < 10;
    //keepFetching = data.info.total < searchParams.offset + searchParams.limit;
    //keepFetching = false;

    // Sleep for specified seconds
    await sleep(SLEEP_SECONDS);
  }
}

export async function* crawlCollections(): AsyncGenerator<any[], void, undefined> {
  const defaultCollectionsParams: GetCollectionsParams = {
    ilsgEntityParams: 'primo_user_institution,01NYA_INST;ils_user_institution,01NYA_INST',
    inst: '01NYA_INST',
    lang: 'en',
    name: 'get_collections',
    useCache: true,
    userInst: '01NYA_INST',
    vid: '01NYA_INST:Brooklyn',
  };
  const url = new URL(COLLECTIONS_URL);
  Object.entries(defaultCollectionsParams).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    for (const collection of data.data.collection) {
      const collectionPid = collection.pid?.value;
      if (!collectionPid) {
        console.error('Collection does not have a PID:', collection);
        continue;
      }
      console.log(`Fetching results for collection: ${collection.name}`);
      for await (const docsBatch of fetchCollectionDocuments(collectionPid)) {
        yield docsBatch; // Yield each batch to the caller
      }
    }
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
}
