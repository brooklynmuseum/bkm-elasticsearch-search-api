import * as https from 'https';
import { promisify } from 'util';
import * as stream from 'stream';

import type { DataMap, JsonData } from '@/types';

const finished = promisify(stream.finished);

export async function importSanityDataMap(
  projectId: string,
  dataset: string,
  types?: string[],
): Promise<DataMap> {
  const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/export/${dataset}/${
    types && types.length > 0 ? `?types=${types.join(',')}` : ''
  }`;

  return new Promise<DataMap>((resolve, reject) => {
    let rawData = '';

    const req = https.get(url, (res) => {
      res.on('data', (chunk) => {
        rawData += chunk;
      });
    });

    finished(req)
      .then(() => {
        const dataMap: DataMap = new Map<string, JsonData>();
        const lines = rawData.trim().split('\n');
        lines.forEach((line) => {
          try {
            const item = JSON.parse(line);
            if (item._id) {
              dataMap.set(item._id, item);
            }
          } catch (error) {
            reject(`Error parsing JSON: ${error}`);
          }
        });
        resolve(dataMap);
      })
      .catch(reject);

    req.on('error', (err) => {
      reject('Error: ' + err.message);
    });
  });
}
