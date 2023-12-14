import { denormalizeDocument } from "./denormalize";
import type { JsonData, DataMap } from "../../types";

export async function processChunkedData(
    dataMap: DataMap,
    typesToIndex: string[],
    chunkSize: number,
    asyncProcessChunk: (chunk: JsonData[]) => Promise<void>
): Promise<void> {
    let currentChunk: JsonData[] = [];
    const transformers: Record<string, (doc: JsonData) => JsonData> = {}; // Cache for transform functions

    for (const [_, document] of dataMap) {
        if (typesToIndex.includes(document._type)) {

            if (!transformers[document._type]) {
                try {
                    const transformModule = await import(`./transform/${document._type}.ts`);
                    transformers[document._type] = transformModule.default;
                } catch (error) {
                    console.error(`Error loading transform function for type ${document._type}:`, error);
                    continue;
                }
            }

            const denormalizedDocument = denormalizeDocument(dataMap, document);
            const transformedDocument = transformers[document._type](denormalizedDocument);
            currentChunk.push(transformedDocument);
            console.log(JSON.stringify(transformedDocument))

            if (currentChunk.length === chunkSize) {
                await asyncProcessChunk(currentChunk);
                currentChunk = [];
                return;
            }
        }
    }

    if (currentChunk.length > 0) {
        await asyncProcessChunk(currentChunk);
    }
}
