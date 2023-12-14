import { JsonData } from '../../../types';

export default function transformCollectionObject(collectionObject: JsonData): JsonData {
    const esDoc: JsonData = {
        _id: collectionObject._id,
        title: collectionObject.title || '',
        description: collectionObject.description || ''
    };
    if (collectionObject.constituents && Array.isArray(collectionObject.constituents)) {
        const primaryArtist = collectionObject.constituents.find(constituent => 
            constituent.role && constituent.role.name === 'Artist' && constituent.artist
        );
        if (primaryArtist && primaryArtist.artist.name) {
            esDoc.primaryConstituent = {
                id: primaryArtist.artist._id,
                name: primaryArtist.artist.name
            }
        }
    }
    return esDoc;
}
