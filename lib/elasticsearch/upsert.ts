import { JsonData } from '../../types';
import { client } from './client';

/**
 * Documents to be indexed must define an `_id` property.
 * 
 * @param indexName 
 * @param documents 
 */
export async function bulkUpsertToElasticsearch(indexName: string, documents: JsonData[]): Promise<void> {

    const body = documents.flatMap(doc => {
        const docClone = { ...doc };
        delete docClone._id; // Delete the _id property
        return [
            { update: { _index: indexName, _id: doc._id } },
            { doc: docClone, doc_as_upsert: true }
        ];
    });
    
    try {
        const bulkResponse = await client.bulk({ refresh: true, body });

        if (bulkResponse.errors) {
            const erroredDocuments: any[] = [];
            bulkResponse.items.forEach((action: any, i: number) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        ...documents[i],
                        error: action[operation].error,
                    });
                }
            });
            console.log('Some documents failed to upload:', erroredDocuments);
        } else {
            console.log('All documents uploaded successfully');
        }
    } catch (err) {
        console.error('Failed to upload documents:', err);
    }
}
