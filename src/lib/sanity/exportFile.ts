import { promises as fs } from 'fs';

import type { JsonData, DataMap } from '../../types';

export async function exportFromFile(filePath: string): Promise<DataMap> {
  try {
    const rawData = await fs.readFile(filePath, { encoding: 'utf8' });
    const dataMap = new Map<string, JsonData>();
    const lines = rawData.trim().split('\n');

    lines.forEach((line) => {
      try {
        const item = JSON.parse(line);
        if (item._id) {
          dataMap.set(item._id, item);
        }
      } catch (error) {
        throw new Error(`Error parsing JSON: ${error}`);
      }
    });

    return dataMap;
  } catch (error) {
    throw new Error(`Error reading file: ${error}`);
  }
}
